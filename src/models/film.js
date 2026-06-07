const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Film', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    poster: { type: DataTypes.STRING },
    synopsis: { type: DataTypes.TEXT },
    releaseDate: { type: DataTypes.DATEONLY },
    minAge: { type: DataTypes.INTEGER }
  });
};
