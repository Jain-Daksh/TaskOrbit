import { Response } from 'express';


const Failed = (res: Response, message: string, statusCode: number) => {
  return res
    .status(statusCode)
    .json({ code: statusCode, message: message, data: {} });
};

const Success = (
  res: Response,
  message: string,
  statusCode: number,
  result = {},
) => {
  return res.status(statusCode).json({
    code: statusCode,
    message: message,
    data: result || {},
  });
};

const Unauthorized = (
  res: Response,
  message: string,
  statusCode: number,
  result = {}
) => {
  return res.status(statusCode).json({
    code: statusCode,
    message: message,
    data: result || {},
  });
};

export default { Failed, Success, Unauthorized };
