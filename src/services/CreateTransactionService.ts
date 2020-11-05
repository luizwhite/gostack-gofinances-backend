import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

/* eslint-disable class-methods-use-this, camelcase */
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (value <= 0) throw new AppError('Transaction value is invalid!', 400);

    const transactionsRepository = getCustomRepository(TransactionRepository);
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('No sufficient balance!', 400);
    }

    const categoryRepository = getRepository(Category);

    let categoryFound = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryFound) {
      categoryFound = await categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(categoryFound);
    }

    const { id: category_id } = categoryFound;

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
