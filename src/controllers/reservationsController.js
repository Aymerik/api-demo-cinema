const { Op } = require('sequelize');
const { Reservation, Session, Room } = require('../models');

async function validateReservation(sessionId, seats, excludeReservationId = null) {
  if (!sessionId || !seats) {
    return 'Session et nombre de places sont obligatoires';
  }

  const seatCount = parseInt(seats, 10);

  if (!Number.isInteger(seatCount) || seatCount <= 0) {
    return 'Le nombre de places doit être un entier positif';
  }

  const session = await Session.findByPk(sessionId, { include: [Room] });

  if (!session) {
    return 'Séance introuvable';
  }

  const startAt = new Date(session.startAt);

  if (isNaN(startAt.getTime())) {
    return 'Date de séance invalide';
  }

  if (startAt <= new Date()) {
    return 'La séance est déjà passée';
  }

  const reservedTotal = await Reservation.sum('seats', {
    where: { sessionId }
  }) || 0;

  const existingSeats = excludeReservationId ? await Reservation.sum('seats', {
    where: {
      sessionId,
      id: { [Op.ne]: excludeReservationId }
    }
  }) || 0 : reservedTotal;

  const available = session.Room.capacity - existingSeats;

  if (seatCount > available) {
    return `Il ne reste que ${available} place(s) disponibles pour cette séance`;
  }

  return null;
}

exports.list = async (req, res) => {
  try {
    const items = await Reservation.findAll({ include: [Session] });

    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { sessionId, seats, firstname, lastname } = req.body;

    if (!sessionId || !seats || !firstname || !lastname) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const validation = await validateReservation(sessionId, seats);

    if (validation) {
      return res.status(400).json({ error: validation });
    }

    const reservation = await Reservation.create({ sessionId, seats: parseInt(seats, 10), firstname, lastname });

    return res.json(reservation);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    const { sessionId, seats, firstname, lastname } = req.body;
    const validation = await validateReservation(sessionId || reservation.sessionId, seats || reservation.seats, reservation.id);

    if (validation) {
      return res.status(400).json({ error: validation });
    }

    reservation.sessionId = sessionId || reservation.sessionId;
    reservation.seats = parseInt(seats, 10);
    reservation.firstname = firstname || reservation.firstname;
    reservation.lastname = lastname || reservation.lastname;
    await reservation.save();

    return res.json(reservation);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Reservation.destroy({ where: { id: req.params.id } });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
