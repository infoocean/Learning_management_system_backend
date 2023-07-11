const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class EmailType extends Model {
        static assocaite(model) { }
    }

    EmailType.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: true
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
            modelName: 'email-type'
        }
    )

    return EmailType
}
