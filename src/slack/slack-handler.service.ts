import { Injectable } from '@nestjs/common';
import {
  IncomingSlackEvent,
  IncomingSlackInteractivity,
  IncomingSlackViewInteractivity,
  SlackEventHandlerConfig,
  SlackInteractivityHandlerConfig,
} from './interfaces';

@Injectable()
export class SlackHandler {
  private readonly _eventHandlers: SlackEventHandlerConfig[];
  private readonly _interactivityHandlers: SlackInteractivityHandlerConfig[];

  constructor() {
    this._eventHandlers = [];
    this._interactivityHandlers = [];
  }

  addEventHandler(handler: SlackEventHandlerConfig) {
    this._eventHandlers.push(handler);
  }

  addInteractivityHandler(handler: SlackInteractivityHandlerConfig) {
    this._interactivityHandlers.push(handler);
  }

  async handleSingleEvent(
    event: IncomingSlackEvent,
    handlerConfig: SlackEventHandlerConfig,
  ) {
    const { eventType, filter, handler } = handlerConfig;

    if (eventType) {
      if (event.event.type != eventType) {
        return;
      }
    }

    if (filter) {
      try {
        if (!filter(event)) {
          return;
        }
      } catch (e) {
        return;
      }
    }

    return handler(event);
  }

  checkInteractivityType(
    payload: IncomingSlackInteractivity | IncomingSlackViewInteractivity,
  ): payload is IncomingSlackViewInteractivity {
    return payload.type === 'view_submission';
  }

  async handleSingleInteractivity(
    payload: IncomingSlackInteractivity | IncomingSlackViewInteractivity,
    handlerConfig: SlackInteractivityHandlerConfig,
  ) {
    const { actionId, filter, handler } = handlerConfig;

    if (!this.checkInteractivityType(payload)) {
      if (actionId) {
        if (
          payload.actions.filter((action) => action.action_id == actionId)
            .length == 0
        ) {
          return;
        }
      }
    } else {
      if (actionId) {
        if (payload.view.callback_id !== actionId) return;
      }
    }

    if (filter) {
      if (!filter(payload)) {
        return;
      }
    }

    return handler(payload);
  }

  /**
   * Event Request 대응 메서드
   * @param event
   */
  async handleEvent(event: IncomingSlackEvent) {
    return Promise.all(
      this._eventHandlers.map(
        async (handlerConfig) =>
          await this.handleSingleEvent(event, handlerConfig),
      ),
    );
  }

  /**
   * Interactivity Request 대응 메서드
   * @param payload
   */
  async handleInteractivity(
    payload: IncomingSlackInteractivity | IncomingSlackViewInteractivity,
  ) {
    const response = await Promise.all(
      this._interactivityHandlers.map(
        async (handlerConfig) =>
          await this.handleSingleInteractivity(payload, handlerConfig),
      ),
    );

    const filtered = response.filter((elements) => {
      return elements != null && elements !== '';
    });

    return filtered.length == 1 ? filtered[0] : filtered;
  }
}
