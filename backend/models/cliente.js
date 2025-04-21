const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  identificacion: { type: String, required: true },
  direccion: String,
  email: String,
  telefono: String,
  ciudad: { type: String, required: true }
});

module.exports = mongoose.model('Cliente', clienteSchema);


  