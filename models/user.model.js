'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {

    class User extends Model {
        static associate(model){}
    }
    User.init({
            id : {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            first_name : {
                type: DataTypes.STRING,
            },
            last_name : {
                type: DataTypes.STRING,
            },
            profile_pic: {
                type: DataTypes.STRING,
            },
            email : {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            password : {
                type: DataTypes.STRING,            
            },
            role_id : {
                type: DataTypes.INTEGER,
                defaultValue:2,
            },
            status : {
                type: DataTypes.STRING,
                defaultValue:'active',
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
            loggedin_by : {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            loggedin_time: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }

        },
        {
            sequelize,
            modelName: "users"
        })
    // sequelize.sync( { alter: true  } ).then(() => {
    //     console.log('User table created successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })

    return User
}
