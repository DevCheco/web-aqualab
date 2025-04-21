document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main-content');

  function cargarVista(nombreVista) {
    const archivo = `vistas/${nombreVista}.html`;

    fetch(archivo)
      .then(res => {
        if (!res.ok) throw new Error(`Error al cargar ${archivo}`);
        return res.text();
      })
      .then(html => {
        main.innerHTML = html;

        // === NUEVA COTIZACIÓN ===
        if (nombreVista === 'nueva-cotizacion') {
          // Llenar el select de clientes
          fetch('http://localhost:3000/api/clientes')
            .then(res => res.json())
            .then(clientes => {
              const select = document.getElementById('select-clientes');
              if (select) {
                clientes.forEach(cliente => {
                  const option = document.createElement('option');
                  option.value = cliente._id;
                  option.textContent = cliente.nombre;
                  select.appendChild(option);
                });
              }
            });

          // Calcular total automáticamente según servicios seleccionados
          setTimeout(() => {
            const checkboxes = document.querySelectorAll('.servicio');
            const inputTotal = document.querySelector('input[name="total"]');

            if (checkboxes && inputTotal) {
              checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                  let total = 0;
                  checkboxes.forEach(cb => {
                    if (cb.checked) {
                      total += parseInt(cb.value);
                    }
                  });

                  inputTotal.value = total.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0
                  });
                });
              });
            }
          }, 0); // Esperamos a que los elementos estén en el DOM
        }

        // === CREAR CLIENTE ===
        if (nombreVista === 'crear-cliente') {
          const form = document.getElementById('form-crear-cliente');
          if (form) {
            form.addEventListener('submit', function (e) {
              e.preventDefault();

              const datos = {
                nombre: form.nombre.value,
                identificacion: form.identificacion.value,
                direccion: form.direccion.value,
                email: form.email.value,
                telefono: form.telefono.value,
                ciudad: form.ciudad.value,
              };

              if (!datos.ciudad) {
                alert('Por favor selecciona una ciudad');
                return;
              }

              fetch('http://localhost:3000/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
              })
                .then(res => res.json())
                .then(data => {
                  alert('Cliente guardado exitosamente');
                  // cargarVista('nueva-cotizacion'); // opcional
                })
                .catch(err => {
                  console.error(err);
                  alert('Error al guardar cliente');
                });
            });
          }
        }

        // === CLIENTES ===
        if (nombreVista === 'clientes') {
          fetch('http://localhost:3000/api/clientes')
            .then(res => res.json())
            .then(clientes => {
              const tbody = document.getElementById('tabla-clientes-body');
              if (tbody) {
                tbody.innerHTML = '';
                clientes.forEach(cliente => {
                  const fila = document.createElement('tr');
                  fila.innerHTML = `
                    <td>${cliente.nombre}</td>
                    <td>${cliente.identificacion}</td>
                    <td>${cliente.direccion}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.ciudad}</td>
                  `;
                  tbody.appendChild(fila);
                });
              }
            })
            .catch(err => {
              console.error('Error al cargar clientes:', err);
            });
        }
      })
      .catch(err => {
        console.error(err);
        main.innerHTML = `<p>Error al cargar la vista: ${nombreVista}</p>`;
      });
  }

  // Cargar vista por defecto
  cargarVista('inicio');

  // Manejo de clicks en el sidebar
  document.querySelectorAll('.sidebar__item[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      const vista = item.getAttribute('data-view');

      // === CERRAR SESIÓN ===
      if (vista === 'cerrar-sesion') {
        localStorage.removeItem('usuario'); // si guardas info del usuario
        sessionStorage.clear(); // por si usas sessionStorage también
        window.location.href = 'index.html'; // redirigir al login
        return;
      }

      cargarVista(vista);
    });
  });

  // Clics dentro del contenido dinámico que cambian de vista
  main.addEventListener('click', e => {
    const btn = e.target.closest('[data-vista]');
    if (btn) {
      const vista = btn.getAttribute('data-vista');
      cargarVista(vista.replace('.html', ''));
    }
  });
});


