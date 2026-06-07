require('dotenv').config();
const { sequelize, User, Room, Genre } = require('./models');

async function seed(){
  await sequelize.sync({ force: false });

  const admin = await User.findOne({ where: { email: 'admin@admin.fr' } });
  if (!admin){
    await User.create({ email: 'admin@admin.fr', password: 'admin', firstname: 'Admin', lastname: 'User' });
    console.log('Admin user created: admin@admin.fr / admin');
  } else {
    admin.password = 'admin';
    await admin.save();
    console.log('Admin already exists, password updated to default.');
  }

  const existingRooms = await Room.count();
  if (existingRooms < 10) {
    for (let i = 1; i <= 10; i++) {
      const number = String(i);
      const room = await Room.findOne({ where: { number } });
      if (!room) {
        await Room.create({ number, capacity: 50 + i * 5 });
      }
    }
    console.log('10 salles créées ou existantes assurées');
  } else {
    console.log('Salles déjà présentes');
  }

  const genreLabels = ['Action', 'Comédie', 'Drame', 'Science-fiction', 'Fantastique', 'Thriller', 'Aventure', 'Animation', 'Horreur', 'Romance'];
  for (const label of genreLabels) {
    const genre = await Genre.findOne({ where: { label } });
    if (!genre) {
      await Genre.create({ label });
    }
  }
  console.log('10 genres créés ou existants assurés');

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
