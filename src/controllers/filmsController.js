const { Film, Genre } = require('../models');

exports.list = async (req, res) => {
  try {
    const items = await Film.findAll({ include: [{ model: Genre, as: 'genres' }] });

    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, duration, synopsis, releaseDate, minAge, genreIds } = req.body;

    if (!title || !duration) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const poster = req.file ? req.file.filename : null;
    const film = await Film.create({ title, duration: parseInt(duration, 10), poster, synopsis, releaseDate, minAge: minAge ? parseInt(minAge, 10) : null });

    if (genreIds) {
      const ids = Array.isArray(genreIds) ? genreIds : JSON.parse(genreIds);
      const genres = await Genre.findAll({ where: { id: ids } });
      await film.setGenres(genres);
    }

    const created = await Film.findByPk(film.id, { include: [{ model: Genre, as: 'genres' }] });

    return res.json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
