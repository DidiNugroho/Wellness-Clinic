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
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'nama penyakit harus diisi!'
        }
      }
    },
    imageURL: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Username harus diisi!'
        },
        isUrl: {
          msg: 'Url harus valid!'
        }
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Harus pilih kategori!'
        }
      }
    },
    symptoms: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Illness',
  });
  return Illness;
};