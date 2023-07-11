const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class EmailManage extends Model {
        static assocaite(model) { }
    }

    EmailManage.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            emailtype: {
                type: DataTypes.STRING,
                allowNull: true
            },
            emailfrom: {
                type: DataTypes.STRING,
                allowNull: true
            },
            emailsubject: {
                type: DataTypes.STRING,
                allowNull: true
            },
            emailbodytext: {
                type: DataTypes.STRING,
                allowNull: true
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
        },
        {
            sequelize,
            modelName: 'email-manage'
        }
    )

    return EmailManage
}
