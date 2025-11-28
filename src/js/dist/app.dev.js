"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var paso = 1;
var pasoInicial = 1;
var pasoFinal = 3;
var cita = {
  id: '',
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
};
document.addEventListener('DOMContentLoaded', function () {
  iniciarApp();
});

function iniciarApp() {
  tabs();
  mostrarSeccion();
  botonesPaginador();
  paginaSiquiente();
  paginaAnterior();
  consultarAPI();
  idCliente();
  nombreCliente();
  seleccionarFecha();
  seleccionarHora();
  mostrarResumen();
}

window.addEventListener("error", function (e) {
  if (e.filename && e.filename.includes("content_script.js")) {
    e.stopImmediatePropagation();
  }
});

function tabs() {
  var botones = document.querySelectorAll('.tabs button');
  botones.forEach(function (boton) {
    boton.addEventListener('click', function (e) {
      paso = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      botonesPaginador();
    });
  });
}

function mostrarSeccion() {
  document.querySelectorAll('.seccion').forEach(function (sec) {
    sec.classList.remove('mostrar');
  });
  var pasoSelector = "#paso-".concat(paso);
  var seccion = document.querySelector(pasoSelector);

  if (seccion) {
    seccion.classList.add('mostrar');
  }

  var tabAnterior = document.querySelector('.actual');

  if (tabAnterior) {
    tabAnterior.classList.remove('actual');
  }

  var tab = document.querySelector("[data-paso=\"".concat(paso, "\"]"));
  if (tab) tab.classList.add('actual');
}

function botonesPaginador() {
  var paginaAnterior = document.querySelector('#anterior');
  var paginaSiquiente = document.querySelector('#siguiente');

  if (paso === 1) {
    paginaAnterior.classList.add('ocultar');
    paginaSiquiente.classList.remove('ocultar');
  } else if (paso === 3) {
    paginaAnterior.classList.remove('ocultar');
    paginaSiquiente.classList.add('ocultar');
    mostrarResumen();
  } else {
    paginaAnterior.classList.remove('ocultar');
    paginaSiquiente.classList.remove('ocultar');
  }

  mostrarSeccion();
}

function paginaAnterior() {
  var paginaAnterior = document.querySelector('#anterior');
  paginaAnterior.addEventListener('click', function () {
    if (paso <= pasoInicial) return;
    paso--;
    botonesPaginador();
  });
}

function paginaSiquiente() {
  var paginaSiquiente = document.querySelector('#siguiente');
  paginaSiquiente.addEventListener('click', function () {
    if (paso >= pasoFinal) return;
    paso++;
    botonesPaginador();
  });
}

function consultarAPI() {
  var url, resultado, servicios;
  return regeneratorRuntime.async(function consultarAPI$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          url = '${location.origin}/api/servicios';
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(url));

        case 4:
          resultado = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(resultado.json());

        case 7:
          servicios = _context.sent;
          mostrarServicios(servicios);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

function mostrarServicios(servicios) {
  servicios.forEach(function (servicio) {
    var id = servicio.id,
        nombre = servicio.nombre,
        precio = servicio.precio;
    var nombreServicio = document.createElement('P');
    nombreServicio.classList.add('nombre-servicio');
    nombreServicio.textContent = nombre;
    var precioServicio = document.createElement('P');
    precioServicio.classList.add('precio-servicio');
    precioServicio.textContent = "$ ".concat(precio);
    var servicioDiv = document.createElement('DIV');
    servicioDiv.classList.add('servicio');
    servicioDiv.dataset.idServicio = id;

    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);
    document.querySelector('#servicios').appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  var id = servicio.id;
  var servicios = cita.servicios;
  var divServicio = document.querySelector("[data-id-servicio=\"".concat(id, "\"]"));

  if (servicios.some(function (agregado) {
    return agregado.id === id;
  })) {
    cita.servicios = servicios.filter(function (agregado) {
      return agregado.id !== id;
    });
    divServicio.classList.remove('seleccionado');
  } else {
    cita.servicios = [].concat(_toConsumableArray(servicios), [servicio]);
    divServicio.classList.add('seleccionado');
  }

  mostrarResumen();
}

function idCliente() {
  var inputId = document.querySelector('#id');
  cita.id = inputId.value;
  inputId.addEventListener('input', function (e) {
    cita.id = e.target.value;
  });
}

function nombreCliente() {
  var inputNombre = document.querySelector('#nombre');
  cita.nombre = inputNombre.value;
  inputNombre.addEventListener('input', function (e) {
    cita.nombre = e.target.value;
  });
}

function seleccionarFecha() {
  var inputFecha = document.querySelector('#fecha');
  inputFecha.addEventListener('input', function (e) {
    var dia = new Date(e.target.value).getUTCDay();

    if ([6, 0].includes(dia)) {
      e.target.value = '';
      mostrarAlerta('Cerrado los fines de semana', 'error', '.formulario');
    } else {
      cita.fecha = e.target.value;
    }

    mostrarResumen();
  });
}

function mostrarAlerta(mensaje, tipo, elemento) {
  var desaparece = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var alertaPrevia = document.querySelector('.alerta');

  if (alertaPrevia) {
    alertaPrevia.remove();
  }

  ;
  var alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta', tipo);
  var referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if (desaparece) {
    setTimeout(function () {
      alerta.remove();
    }, 3000);
  }
}

function seleccionarHora() {
  var inputHora = document.querySelector('#hora');
  inputHora.addEventListener('input', function (e) {
    var hora = e.target.value.split(':')[0];

    if (hora < 10 || hora > 18) {
      mostrarAlerta('Hora no válida (10 AM - 6 PM)', 'error', '.formulario');
      e.target.value = '';
      cita.hora = '';
    } else {
      cita.hora = e.target.value;
    }

    mostrarResumen();
  });
}

function mostrarResumen() {
  var resumen = document.querySelector('.contenido-resumen'); //limpiar contenido 

  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes('') || cita.servicios.length === 0) {
    mostrarAlerta('Faltan datos por completar', 'error', '.contenido-resumen', false);
    return;
  }

  if (!resumen) return;

  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes('') || cita.servicios.length === 0) {
    mostrarAlerta('Faltan datos por completar', 'error', '.contenido-resumen', false);
    return;
  }

  var nombre = cita.nombre,
      fecha = cita.fecha,
      hora = cita.hora,
      servicios = cita.servicios; //Headind de servicios

  var headingServicios = document.createElement('H3');
  headingServicios.textContent = 'Resumen de Servicios';
  resumen.appendChild(headingServicios); //Iterar servicios

  servicios.forEach(function (servicio) {
    var precio = servicio.precio,
        nombre = servicio.nombre;
    var contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicio');
    var textoServicio = document.createElement('P');
    textoServicio.textContent = nombre;
    var precioServicio = document.createElement('P');
    precioServicio.innerHTML = "<span>Precio:</span> ".concat(precio);
    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);
    resumen.appendChild(contenedorServicio);
  }); //Heading Datos del cliente

  var headingCliente = document.createElement('H3');
  headingCliente.textContent = 'Datos del Cliente';
  resumen.appendChild(headingCliente);
  var nombreCliente = document.createElement('P');
  nombreCliente.innerHTML = "<span>Nombre:</span> ".concat(nombre); //Formatear fecha

  var fechaObj = new Date(fecha);
  var mes = fechaObj.getMonth();
  var dia = fechaObj.getDate() + 2;
  var year = fechaObj.getFullYear();
  var fechaUTC = new Date(Date.UTC(year, mes, dia));
  var opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  var fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);
  var fechaCita = document.createElement('P');
  fechaCita.innerHTML = "<span>Fecha:</span> ".concat(fechaFormateada);

  var _hora$split = hora.split(':'),
      _hora$split2 = _slicedToArray(_hora$split, 2),
      h = _hora$split2[0],
      m = _hora$split2[1];

  var horaNum = parseInt(h);
  var sufijo = horaNum >= 12 ? 'PM' : 'AM';
  horaNum = horaNum > 12 ? horaNum - 12 : horaNum;
  horaNum = horaNum === 0 ? 12 : horaNum; // para las 12 AM

  var horaFormateada = "".concat(horaNum, ":").concat(m, " ").concat(sufijo);
  var horaCita = document.createElement('P');
  horaCita.innerHTML = "<span>Hora:</span> ".concat(horaFormateada); //Reservar boton

  var botonReservar = document.createElement('BUTTON');
  botonReservar.classList.add('boton');
  botonReservar.textContent = 'Reservar Cita';
  botonReservar.addEventListener('click', reservarCita);
  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);
  resumen.appendChild(botonReservar);
}

function reservarCita() {
  var nombre, fecha, hora, servicios, id, idServicios, datos, url, respuesta, resultado;
  return regeneratorRuntime.async(function reservarCita$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          nombre = cita.nombre, fecha = cita.fecha, hora = cita.hora, servicios = cita.servicios, id = cita.id;
          idServicios = servicios.map(function (servicio) {
            return servicio.id;
          });
          datos = new FormData();
          datos.append('fecha', fecha);
          datos.append('hora', hora);
          datos.append('usuarioId', id);
          datos.append('servicios', JSON.stringify(idServicios)); // IMPORTANTE

          _context2.prev = 7;
          url = '${location.origin}/api/citas';
          _context2.next = 11;
          return regeneratorRuntime.awrap(fetch(url, {
            method: 'POST',
            body: datos
          }));

        case 11:
          respuesta = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(respuesta.json());

        case 14:
          resultado = _context2.sent;

          if (resultado.resultado) {
            Swal.fire({
              icon: 'success',
              title: 'Cita registrada',
              text: 'Tu cita fue creada correctamente',
              confirmButtonText: 'OK'
            }).then(function () {
              window.location.reload();
            });
          }

          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](7);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo reservar la cita'
          });
          console.log(_context2.t0);

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 18]]);
}