const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(model) { }
    }

    Payment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            user_id: {
                type: DataTypes.STRING,
            },
            token: {
                type: DataTypes.STRING,
            },
            is_default: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            }
        },
        {
            sequelize,
            modelName: 'payment'
        }
    )

    //    sequelize.sync( {  alter: true } ).then(() => {
    //     console.log('payment_token table alter successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })

    return Payment
}