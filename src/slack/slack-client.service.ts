import { Inject, Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SLACK_CONFIG_OPTIONS } from './constant/symbol';
import { SlackModuleOptions } from './interfaces';

@Injectable()
export class SlackClientService {
  public readonly client: WebClient;

  /**
   * Slack WebClient Instance 를 생성합니다.
   * SLACK_CONFIG_OPTIONS Provider 를 통해 DI 된 SlackModuleOptions 을 사용하여 Instance 생성
   * @param options
   */
  constructor(@Inject(SLACK_CONFIG_OPTIONS) options: SlackModuleOptions) {
    this.client = new WebClient(options.botToken);
  }
}
