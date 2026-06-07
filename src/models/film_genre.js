const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('FilmGenre', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
  });
};
