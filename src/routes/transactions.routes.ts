import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import fs from 'fs';
import multer from 'multer';
import uploadConfig from '../config/upload';

import readCSV from '../middlewares/readCSV';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import CreateManyTransactionsService from '../services/CreateManyTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.getCompleteInfo();

  return response.json(transactions);
});

/* eslint-disable object-curly-newline */
transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.post('/many', async (request, response) => {
  interface MyTransactions {
    transactions: {
      title: string;
      type: 'income' | 'outcome';
      value: number;
      category: string;
    }[];
  }
  const { transactions: transactionsRead }: MyTransactions = request.body;

  const createManyTransaction = new CreateManyTransactionsService();
  const transactions = await createManyTransaction.execute({
    transactionsRead,
  });

  return response.json(transactions);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});
// prettier-ignore
transactionsRouter.post('/import', upload.single('file'), readCSV, async (request, response) => {
  const { lines } = request.fileParsed;
  const importTransaction = new ImportTransactionsService();

  const transactions = await importTransaction.execute({
    lines,
  });

  await fs.promises.unlink(request.file.path);

  return response.json(transactions);
});

export default transactionsRouter;
