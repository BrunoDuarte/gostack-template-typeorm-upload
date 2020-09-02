import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm'

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository'

import Category from '../models/Category'

interface RequestDTO {
  title: string
  type: 'income' | 'outcome'
  value: number
  category: string
}

class CreateTransactionService {

  public async execute({title, value, type, category}: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository)
    const categoryRepository = getRepository(Category)

    const {total} = await transactionRepository.getBalance()

    if (type === 'outcome' && total < value) throw new AppError('You do not have enough balance')

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category
      }
    })

    if(!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category
      })

      await categoryRepository.save(transactionCategory)
    }
    
    const transaction = transactionRepository.create({
      title, 
      value,
      type, 
      category: transactionCategory
    })

    await transactionRepository.save(transaction)

    return transaction

  }
}

export default CreateTransactionService;
