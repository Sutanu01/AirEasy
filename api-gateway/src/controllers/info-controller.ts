import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/common/index.js';

function info(req: Request, res: Response) {
  return res
    .status(StatusCodes.OK)
    .json(SuccessResponse('API Gateway is up and running!', {}));
}

export { info };
