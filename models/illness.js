'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Illness extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Illness.belongsTo(models.Category)
      Illness.belongsToMany(models.User, {through: models.UserIllness})
    }


  }
  Illness.init({
    name: DataTypes.STRING,
    imageURL: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    symptoms: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Illness',
  });
  return Illness;
};