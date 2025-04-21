const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const Usuario = require('./backend/models/Usuario');
const Cliente = require('./backend/models/cliente');
const Cotizacion = require('./backend/models/Cotizacion');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend', 'vistas')));

// Ruta base de vistas
const vistasPath = path.join(__dirname, 'frontend', 'vistas');

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/aqualab', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🔗 Conectado a MongoDB'))
.catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Rutas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(vistasPath, 'index.html'));
});

app.get('/registro', (req, res) => {
  res.sendFile(path.join(vistasPath, 'formulario_registro.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(vistasPath, 'Dashboard.html'));
});

app.get('/crear-cliente', (req, res) => {
  res.sendFile(path.join(vistasPath, 'crear-cliente.html'));
});

app.get('/nueva-cotizacion', (req, res) => {
  res.sendFile(path.join(vistasPath, 'nueva-cotizacion.html'));
});

app.get('/nueva-orden', (req, res) => {
  res.sendFile(path.join(vistasPath, 'nueva-orden.html'));
});

// Registro de usuarios
app.post('/registro', async (req, res) => {
  const { nombreCompleto, correo, usuario, contrasena, confirmarContrasena } = req.body;

  if (!nombreCompleto || !correo || !usuario || !contrasena || !confirmarContrasena) {
    return res.redirect('/registro?error=Todos los campos son obligatorios.');
  }

  if (contrasena !== confirmarContrasena) {
    return res.redirect('/registro?error=Las contraseñas no coinciden.');
  }

  try {
    const usuarioExistente = await Usuario.findOne({ usuario });
    if (usuarioExistente) {
      return res.redirect('/registro?error=El nombre de usuario ya existe.');
    }

    const nuevoUsuario = new Usuario({
      nombreCompleto,
      correo,
      usuario,
      contrasena,
    });

    await nuevoUsuario.save();

    return res.redirect('/?success=Usuario registrado con éxito!');
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    return res.redirect('/registro?error=Ocurrió un error al registrar el usuario.');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const usuarioEncontrado = await Usuario.findOne({ usuario });

    if (usuarioEncontrado && usuarioEncontrado.contrasena === contrasena) {
      return res.redirect('/dashboard.html');
    } else {
      return res.redirect('/?error=Usuario o contraseña incorrectos');
    }
  } catch (error) {
    console.error('❌ Error en login:', error);
    return res.redirect('/?error=Error interno al iniciar sesión');
  }
});

// Guardar cliente
app.post('/api/clientes', async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json({ mensaje: 'Cliente guardado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el cliente' });
  }
});

// Obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
});

// Obtener todas las cotizaciones
app.get('/api/cotizaciones', async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.find().sort({ fecha: -1 });
    res.json(cotizaciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las cotizaciones' });
  }
});

// Guardar cotización
app.post('/api/cotizaciones', async (req, res) => {
  try {
    const nuevaCotizacion = new Cotizacion(req.body);
    await nuevaCotizacion.save();
    res.status(201).json({ mensaje: 'Cotización guardada con éxito' });
  } catch (error) {
    console.error('❌ Error al guardar cotización:', error);
    res.status(500).json({ error: 'Error al guardar la cotización' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
