'use strict';
const bcrypt = require('bcryptjs');  // Include bcrypt here
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**a
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.belongsToMany(models.Illness, { through: models.UserIllness });
    }

    get formattedCreatedAt() {
      // Format createdAt as 'YYYY-MM-DD HH:mm:ss' (or any format you prefer)
      return this.createdAt ? this.createdAt.toISOString().replace('T', ' ').substring(0, 19) : null;
    }
    
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Username harus diisi!'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Email harus diisi!'
        },
        isEmail: {
          msg: 'Email tidak valid!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Password harus diisi!'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Harus pilih role!'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, options) => {
        var bcrypt = require('bcryptjs');
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
      }
    }
  });
  return User;
};