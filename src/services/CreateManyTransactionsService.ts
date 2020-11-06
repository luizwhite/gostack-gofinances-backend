import { getCustomRepository, getRepository } from 'typeorm';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CheckCategoriesFromListService from './CheckCategoriesFromListService';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface Request {
  transactionsRead: CSVTransaction[];
}

/* eslint-disable class-methods-use-this, camelcase */
class CreateManyTransactionsService {
  public async execute({ transactionsRead }: Request): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    const allCategories: Category[] = [];
    const categoriesTitlesNotFiltered: string[] = [];
    let categoriesCreated: Category[] = [];

    transactionsRead.forEach(({ category }) => {
      categoriesTitlesNotFiltered.push(category);
    });

    const checkCategoriesFromList = new CheckCategoriesFromListService();
    const {
      categoriesTitlesCreated,
      categoriesFound,
    } = await checkCategoriesFromList.execute({
      categoryTitles: categoriesTitlesNotFiltered,
    });

    if (categoriesTitlesCreated.length > 0) {
      categoriesCreated = categoryRepository.create(
        categoriesTitlesCreated.map((title) => ({
          title,
        })),
      );

      await categoryRepository.save(categoriesCreated);
    }
    allCategories.push(...categoriesFound, ...categoriesCreated);

    const transactions = transactionsRepository.create(
      transactionsRead.map((transaction) => ({
        ...transaction,
        category: allCategories.find(
          ({ title }) => title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(transactions);

    return transactions;
  }
}

export default CreateManyTransactionsService;
