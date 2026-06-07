const { Genre } = require('../models');

exports.list = async (req, res) => {
  try {
    const items = await Genre.findAll();

    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
