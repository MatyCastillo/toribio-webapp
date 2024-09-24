const express = require('express');
const cors = require('cors');
const app = express();
const statusRoute = require('./routes/statusRoute');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');


require('dotenv').config();

// Middleware para parsear JSON
app.use(express.json());
app.use(cors());

app.use(express.json());

// Registrar la ruta de estado "alive" en la ruta específica
app.use('/api/v1', statusRoute);

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/pagos', paymentsRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
