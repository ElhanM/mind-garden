import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  const userEmail = req.headers['user-email']; // Extract from headers

  if (!userEmail || typeof userEmail !== 'string') {
    res.status(400).json({ error: 'User email is required' });
    return; // Exit function to avoid further execution
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: userEmail } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return; // Ensure function stops here
    }

    res.json({ userId: user.id }); // Send response properly
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
