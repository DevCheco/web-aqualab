const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombreCompleto: String,
  correo: String,
  usuario: { type: String, unique: true },
  contrasena: String, // En un proyecto real, encripta la contraseña con bcrypt
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;

