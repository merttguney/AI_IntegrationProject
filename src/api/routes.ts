import express, { Request, Response } from 'express';
import { authenticate } from '../utils/auth';
import { publishToQueue } from '../queue/producer';

const router = express.Router();

router.post('/process', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { data, operationType, queueName } = req.body;

  if (!data || !operationType || !queueName) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  try {
    await publishToQueue(queueName, { data, operationType });
    res.status(200).json({ message: 'Request processed successfully' });
  } catch (error) {
    console.error('Error publishing to queue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;