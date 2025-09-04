import { Response } from "express";

export const sendMethodNotImplemented = (res: Response, method: string = 'Method') => {
  return res.status(501).json({
    message: `${method} not implemented`
  });
}

export const sendNotFound = (res: Response, message: string = 'Not found') => {
  return res.status(404).json({
    message
  });
}

export const sendBadRequest = (res: Response, message: string = 'Bad request') => {
  return res.status(400).json({
    message
  });
}

export const sendOk = (res: Response, data: any) => {
  return res.status(200).json(data);
}

export const sendCreated = (res: Response, data: any) => {
  return res.status(201).json(data);
}
