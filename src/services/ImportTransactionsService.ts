import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

import CreateManyTransactionsService from './CreateManyTransactionsService';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface LinesDTO {
  lines: string[][];
}

/* eslint-disable class-methods-use-this, camelcase, no-restricted-syntax, no-await-in-loop */
class ImportTransactionsService {
  async execute({
    lines: requestParsedData,
  }: LinesDTO): Promise<Transaction[]> {
    const transactionsRead: CSVTransaction[] = [];

    requestParsedData.forEach((line, index) => {
      const [title, type, value, category] = line;

      if (!title || !type || !value || !category) {
        throw new AppError(`Missing data in line ${index}!`);
      }
      if (type !== 'outcome' && type !== 'income') {
        throw new AppError(`Invalid transaction type in line ${index}`);
      }

      const myTransaction: CSVTransaction = {
        title,
        value: parseInt(value, 10),
        type,
        category,
      };

      transactionsRead.push(myTransaction);
    });

    const createManyTransactions = new CreateManyTransactionsService();
    const transactions = await createManyTransactions.execute({
      transactionsRead,
    });

    return transactions;
  }
}

export default ImportTransactionsService;
