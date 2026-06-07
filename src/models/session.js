const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Session', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    startAt: { type: DataTypes.DATE, allowNull: false },
    language: { type: DataTypes.ENUM('VO','VF'), allowNull: false }
  });
};
