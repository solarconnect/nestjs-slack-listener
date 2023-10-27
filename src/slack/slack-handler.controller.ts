import { Body, Controller, Post } from '@nestjs/common';
import { IncomingSlackEvent } from './interfaces';
import { SlackHandler } from './slack-handler.service';

@Controller('slack')
export class SlackEventsController {
  constructor(private readonly slackHandler: SlackHandler) {}

  /**
   * event request 용 EndPoint
   * @param event
   */
  @Post(`events`)
  async handleEvent(@Body() event: IncomingSlackEvent) {
    if (event.challenge) {
      // URL 검증 대응 코드
      return {
        challenge: event.challenge,
      };
    }
    return this.slackHandler.handleEvent(event);
  }

  /**
   * interactivity request 용 EndPoint
   * @param params
   */
  @Post(`interactivity`)
  async handleInteractivity(@Body() params: { payload: string }) {
    return this.slackHandler.handleInteractivity(JSON.parse(params.payload));
  }
}
