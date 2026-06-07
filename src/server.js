require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const genresRoutes = require('./routes/genres');
const roomsRoutes = require('./routes/rooms');
const filmsRoutes = require('./routes/films');
const sessionsRoutes = require('./routes/sessions');
const reservationsRoutes = require('./routes/reservations');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Swagger UI - serve OpenAPI spec at /api/docs
let swaggerDocument;
try {
  swaggerDocument = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.warn('Could not load openapi.yaml for Swagger UI', e.message);
}

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/films', filmsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/reservations', reservationsRoutes);

const PORT = process.env.PORT || 4000;

async function start(){
  try{
    await sequelize.sync();
    console.log('Database synced');
    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
  }catch(err){
    console.error('Failed to start', err);
  }
}

start();
