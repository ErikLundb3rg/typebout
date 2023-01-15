import { NextFunction, Request, Response } from 'express';

interface BaseResponse {
  message: string | null;
  data: unknown;
  status: number;
  ok: boolean;
}

export const defaultErrorResponse = (
  overrides: Partial<Omit<BaseResponse, 'ok'>>
): BaseResponse => ({
  message: overrides.message || null,
  data: overrides.data || null,
  status: overrides.status || 400,
  ok: false
});

export const defaultHappyResponse = (
  overrides: Partial<Omit<BaseResponse, 'ok'>>
): BaseResponse => ({
  message: overrides.message || null,
  data: overrides.data || null,
  status: overrides.status || 200,
  ok: true
});

export type AsyncController<Body> = (
  req: Request<object, object, Body>,
  res: Response
) => Promise<BaseResponse>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncHandler = (controller: AsyncController<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await controller(req, res);
      const { message, data, status, ok } = response;
      res.status(status).send({
        message,
        ok,
        data
      });
    } catch (error) {
      next(error);
    }
  };
};
