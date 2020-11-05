import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface ImportedTransaction {
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
    const createTransaction = new CreateTransactionService();
    const transactions: Transaction[] = [];

    for (const line of requestParsedData) {
      if (line[1] !== 'outcome' && line[1] !== 'income') {
        throw Error(
          `Invalid transaction type in line ${requestParsedData.indexOf(line)}`,
        );
      }

      const importedTransaction: ImportedTransaction = {
        title: line[0],
        value: parseInt(line[2], 10),
        type: line[1],
        category: line[3],
      };

      const transaction = await createTransaction.execute(importedTransaction);

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
