import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

/* eslint-disable class-methods-use-this */
class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError("Transaction informed doesn't exist!", 406);
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
