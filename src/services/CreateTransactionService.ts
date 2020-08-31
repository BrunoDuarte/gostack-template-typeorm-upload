import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm'

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository'

import Category from '../models/Category'

interface RequestDTO {
  title: string
  value: number
  type: 'income' | 'outcome'
  category_id: string
}

class CreateTransactionService {

  public async execute({title, value, type, category_id}: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository)
    const categoryRepository = getRepository(Category)

    const findCategory = await categoryRepository.findOne({where: {title: category_id}})

    if (!findCategory) {
      const newCategory = categoryRepository.create({
        title: category_id
      })

      await categoryRepository.save(newCategory)
    }

    const findCategory2 = await categoryRepository.findOne({where: {title: category_id}})

    const transaction = transactionRepository.create({
      title, 
      value, 
      type, 
      category_id: findCategory2?.id
    })

    await transactionRepository.save(transaction)

    return transaction

  }
}

export default CreateTransactionService;
