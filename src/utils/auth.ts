import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const apiSecret = req.headers['x-api-secret'];

  if (apiKey === process.env.API_KEY && apiSecret === process.env.API_SECRET) {
    next();
  } else {
    console.error('Unauthorized request', process.env.API_KEY, process.env.API_SECRET);
    res.status(401).json({ error: 'Unauthorized' });
  }
};