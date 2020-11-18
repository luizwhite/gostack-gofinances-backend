import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
/* eslint-disable camelcase */
interface TransactionWithCategory {
  id: string;
  title: string;
  value: number;
  type: string;
  category: Category;
  created_at: Date;
  updated_at: Date;
}

interface CompleteInfo {
  transactions: TransactionWithCategory[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions
      .filter(({ type }) => type === 'income')
      .reduce((total, { value }) => total + value, 0);

    const outcome = transactions
      .filter(({ type }) => type === 'outcome')
      .reduce((total, { value }) => total + value, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public async getCompleteInfo(): Promise<CompleteInfo> {
    // const transactions = await this.find({
    //   relations: ['category'],
    //   select: ['id', 'title', 'type', 'value', 'created_at', 'updated_at'],
    // });
    const transactions = await this.find();
    const balance = await this.getBalance();

    const completeInfo = {
      transactions,
      balance,
    };

    return completeInfo;
  }
}

export default TransactionsRepository;
