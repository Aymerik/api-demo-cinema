const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false
});

const User = require('./user')(sequelize);
const Genre = require('./genre')(sequelize);
const Room = require('./room')(sequelize);
const Film = require('./film')(sequelize);
const FilmGenre = require('./film_genre')(sequelize);
const Session = require('./session')(sequelize);
const Reservation = require('./reservation')(sequelize);

// Associations
Film.belongsToMany(Genre, { through: FilmGenre, as: 'genres' });
Genre.belongsToMany(Film, { through: FilmGenre, as: 'films' });

Film.hasMany(Session, { foreignKey: 'filmId' });
Session.belongsTo(Film, { foreignKey: 'filmId' });

Room.hasMany(Session, { foreignKey: 'roomId' });
Session.belongsTo(Room, { foreignKey: 'roomId' });

Session.hasMany(Reservation, { foreignKey: 'sessionId' });
Reservation.belongsTo(Session, { foreignKey: 'sessionId' });

module.exports = {
  sequelize,
  User,
  Genre,
  Room,
  Film,
  FilmGenre,
  Session,
  Reservation
};
