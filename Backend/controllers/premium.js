const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../utils/databse');

const getUserLeaderboard = async (req, res) => {
  try {
    const userLeaderboard = await User.findAll(
      { where: { id: req.user.id } },
      {
        order: [['totalExpense', 'DESC']],
      }
    );
    res.status(200).send(userLeaderboard);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getUserLeaderboard,
};
