const mongoose = require('mongoose');

const cotizacionSchema = new mongoose.Schema({
  cliente: String,
  total: Number,
  fecha: Date,
  servicios: [String],
});

const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);

