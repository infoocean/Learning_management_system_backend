const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static assocaite(model) {}
  }

  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      trx_amount: {
        type: DataTypes.FLOAT,
      },
      payment_method: {
        type: DataTypes.STRING,
      },
      transaction_id: {
        type: DataTypes.STRING,
      },
      created_by: {
        type: DataTypes.INTEGER,
      },
      updated_by: {
        type: DataTypes.INTEGER,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deleted_by: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "transaction-record",
    }
  );

  // sequelize.sync({ alter: true }).then(() => {
  //     console.log('course table created successfully!');
  // }).catch((error) => {
  //     console.error('Unable to create table : ', error);
  // })

  return Transaction;
};
