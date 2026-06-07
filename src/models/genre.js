const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Genre', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label: { type: DataTypes.STRING, allowNull: false }
  });
};
