'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }

    get registered() {
      if (this.createdAt instanceof Date) {
        return this.createdAt.toISOString().split('T')[0];
      }
      return 'Date not available';
    }
  }
  Profile.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    specialization: DataTypes.STRING,
    contact: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};