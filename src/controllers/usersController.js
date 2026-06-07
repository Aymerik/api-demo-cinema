const { User } = require('../models');

exports.list = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'firstname', 'lastname'] });

    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await User.create({ email, password, firstname, lastname });

    return res.json({ id: user.id, email: user.email });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await User.destroy({ where: { id } });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'email', 'firstname', 'lastname'] });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password, oldPassword } = req.body;

    if (!password || !oldPassword) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await User.findByPk(req.user.id);
    const ok = await user.checkPassword(oldPassword);

    if (!ok) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    user.password = password;
    await user.save();

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
