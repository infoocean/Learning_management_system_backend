const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        static associate(model) { }
    }

    Token.init(
        {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
           
           token_id: {
            type: DataTypes.STRING,
            },
            key: {
                type: DataTypes.STRING,
            },
            value: {
                type: DataTypes.STRING
            }

        },
        {
            sequelize,
            modelName: 'token_data'
        }
    )

    //    sequelize.sync( {  alter: true } ).then(() => {
    //     console.log('token table alter successfully!');
    //   }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    //   })

    return Token
}