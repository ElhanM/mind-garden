import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { throwError } from './responseHandlers';

export const getUserByEmail = async (userEmail: string) => {
  if (!userEmail) {
    throwError('User email is required', 400);
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: userEmail } });

  if (!user) {
    throwError('User not found', 404);
  }

  return user;
};
