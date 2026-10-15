const express = require('express');
const cors = require('cors');
const path = require('path');

const citaRepository = require('./src/persistencia/citaRepository');
const profesionalRepository = require('./src/persistencia/profesionalRepository');

const { crearCitaService } = require('./src/aplicacion/citaService');
const { crearCitasRoutes } = require('./src/presentacion/citasRoutes');

const app = express();

// Construir el servicio con sus repositorios concretos
const citaService = crearCitaService({
  citaRepository,
  profesionalRepository
});

// Entregar el servicio a las rutas (soporta objeto { citaService } según guía Semana 9)
const citasRoutes = crearCitasRoutes({ citaService });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', citasRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Cliente web: http://localhost:${PORT}`);
});
