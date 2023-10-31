import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
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
   * retry 방지용 코드 추가
   * https://api.slack.com/apis/connections/events-api#error-handling
   * @param params
   * @param response
   */
  @Post(`interactivity`)
  async handleInteractivity(
    @Body() params: { payload: string },
    @Res() response: Response,
  ) {
    const parsedPayload = JSON.parse(params.payload);
    await this.slackHandler.handleInteractivity(parsedPayload);
    return response.status(200).send();
  }
}
