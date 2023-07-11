const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Module extends Model {
        static associate(model) { }
    }

    Module.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            title: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            course_id: {
                type: DataTypes.INTEGER,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            created_by: {
                type: DataTypes.INTEGER,
            },
            updated_by: {
                type: DataTypes.INTEGER,
            },
            status: {
                type: DataTypes.STRING,
            },
            is_deleted : {
                type : DataTypes.BOOLEAN,
                defaultValue: false,
            },
            deleted_by : {
                type : DataTypes.INTEGER,
            }
        },
        {
            sequelize,
            modelName: 'module'
        }
    )

    //  sequelize.sync( { alter: true } ).then(() => {
    //     console.log('module table created successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })

      return Module
}