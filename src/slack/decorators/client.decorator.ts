import { Inject } from '@nestjs/common';
import { SLACK_CLIENT } from '../constant/symbol';

/**
 * Slack Client Inject 용 Decorator
 * @constructor
 */
export const InjectSlackClient = () => Inject(SLACK_CLIENT);
