'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class journey extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            journey.belongsTo(models.user, {
                foreignKey: 'userId',
            })
        }
    }
    journey.init(
        {
            title: DataTypes.STRING,
            userId: DataTypes.INTEGER,
            description: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'journey',
        }
    )
    return journey
}
