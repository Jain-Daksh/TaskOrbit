import { Response } from 'express';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  error?: any;
}

export const Success = <T>(
  res: Response,
  message: string,
  data: T = {} as T,
  statusCode = 200,
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data,
  });
};

export const Failed = (
  res: Response,
  message: string,
  statusCode = 400,
  error?: any,
): Response<ApiResponse<{}>> => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: {},
    ...(error && { error }),
  });
};

export const Unauthorized = (
  res: Response,
  message = 'Unauthorized',
  statusCode = 401,
  error?: any,
): Response<ApiResponse<{}>> => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: {},
    ...(error && { error }),
  });
};

export const NotFound = (
  res: Response,
  message = 'Resource not found',
  statusCode = 404,
): Response<ApiResponse<{}>> => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: {},
  });
};

export const ServerError = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  error?: any,
): Response<ApiResponse<{}>> => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: {},
    ...(error && { error }),
  });
};
