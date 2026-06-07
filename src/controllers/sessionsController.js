const { Session, Film, Room } = require('../models');

exports.list = async (req, res) => {
  try {
    const items = await Session.findAll({ include: [Film, Room] });

    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { filmId, roomId, startAt, language } = req.body;

    if (!filmId || !roomId || !startAt || !language) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const film = await Film.findByPk(filmId);

    if (!film) {
      return res.status(404).json({ error: 'Film introuvable' });
    }

    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ error: 'Salle introuvable' });
    }

    const startDate = new Date(startAt);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Date de début invalide' });
    }

    if (startDate <= new Date()) {
      return res.status(400).json({ error: 'La séance doit être programmée dans le futur' });
    }

    const duration = Number.isFinite(Number(film.duration)) ? Number(film.duration) : 120;
    const endDate = new Date(startDate.getTime() + duration * 60000);

    const existingSessions = await Session.findAll({ where: { roomId }, include: [Film] });
    const conflict = existingSessions.find(session => {
      const otherStart = new Date(session.startAt);
      const otherDuration = Number.isFinite(Number(session.Film?.duration)) ? Number(session.Film.duration) : 120;
      const otherEnd = new Date(otherStart.getTime() + otherDuration * 60000);
      return startDate < otherEnd && otherStart < endDate;
    });

    if (conflict) {
      return res.status(400).json({ error: 'La salle est déjà réservée sur cette plage horaire' });
    }

    const s = await Session.create({ filmId, roomId, startAt: startDate, language });

    return res.json(s);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
