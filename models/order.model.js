const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static assocaite(model) { }
    }

    Order.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            subscription_id: {
                type: DataTypes.INTEGER,
            },
            transaction_id: {
                type: DataTypes.STRING,
            },
            payment_type: {
                type: DataTypes.STRING,
            },
            amount: {
                type: DataTypes.FLOAT
            },
            status: {
                type: DataTypes.STRING,
            },
            parent_order_id: {
                type: DataTypes.INTEGER,
            },
            order_type: {
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
            }

        },
        {
            sequelize,
            modelName: 'order'
        }
    )

    // sequelize.sync({ alter: true }).then(() => {
    //     console.log('course table created successfully!');
    // }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    // })

    return Order
}
