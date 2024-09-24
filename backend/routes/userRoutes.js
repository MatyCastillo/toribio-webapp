const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const UserModel = require('../models/userModel');

// Ruta para crear un nuevo usuario
router.post('/', userController.createUser);

// Ruta para obtener un usuario por ID
router.get('/users/:id', userController.getUserById);

// Ruta para actualizar un usuario por ID
router.put('/users/:id', userController.updateUserById);

// Ruta para eliminar un usuario por ID
router.delete('/users/:id', userController.deleteUserById);

// Ruta para obtener todos los usuarios
router.get('/users', userController.getAllUsers);

// Ruta para obtener un usuario por nombre de usuario (opcional)
router.get('/users/username/:username', userController.getUserByUsername);

// Ruta para actualizar la última vez que el usuario inició sesión
router.patch('/users/:id/last-login', userController.updateLastLogin);

router.get('/check-username', async (req, res) => {
    const { username } = req.query;
  
    try {
      const user = await UserModel.getUserByUsername(username);
      res.json({ isUnique: !user });
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar el nombre de usuario' });
    }
  });

module.exports = router;
