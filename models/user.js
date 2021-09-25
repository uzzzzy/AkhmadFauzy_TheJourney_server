'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            user.hasMany(models.journey, {
                foreignKey: 'userId',
            })
        }
    }
    user.init(
        {
            fullName: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            phone: DataTypes.STRING,
            address: DataTypes.TEXT,
            image: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'user',
        }
    )
    return user
}
