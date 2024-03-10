const Expense = require('../models/expense');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');

const extractId = (token) => jwt.verify(token, 'secretKey').id;

const postExpense = async (req, res, next) => {
  try {
    req.body.userId = extractId(req.body.userId);
    const expense = await Expense.create(req.body);
    const totalExpense = Number(req.user.totalExpense) + Number(expense.amount);
    User.update(
      { totalExpense },
      {
        where: {
          id: req.body.userId,
        },
      }
    );
    res.send({ newExpenseDetails: expense });
  } catch (error) {
    throw new Error(error);
  }
};

const getExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenseList = await Expense.findAll({ where: { userId } });
    res.send({ expenseDetails: expenseList });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const id = req.user.id;
    const expenseId = req.params.id;
    const amount = req.query.amount;
    const totalExpense = req.user.totalExpense - Number(amount);

    await User.update(
      { totalExpense },
      {
        where: {
          id: id,
        },
      }
    );

    await Expense.destroy({
      where: {
        id: expenseId,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  postExpense,
  getExpense,
  deleteExpense,
};
