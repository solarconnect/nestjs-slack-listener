import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingSlackCommand } from '../interfaces';

/**
 * Wrap Request Body to IncomingSlackCommand Decorator
 */
export const SlackCommandBody = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.body as IncomingSlackCommand;
  },
);
