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
var pasoInicial = 1,
    pasoFinal = 3;
var cita = {
  id: "",
  nombre: "",
  fecha: "",
  hora: "",
  servicios: []
};

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
/* --------------------------------------------- */

/*   CAMBIO DE TABS                              */

/* --------------------------------------------- */


function tabs() {
  document.querySelectorAll(".tabs button").forEach(function (boton) {
    boton.addEventListener("click", function (e) {
      paso = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      botonesPaginador();
    });
  });
}

function mostrarSeccion() {
  document.querySelectorAll(".seccion").forEach(function (sec) {
    return sec.classList.remove("mostrar");
  });
  var seccion = document.querySelector("#paso-".concat(paso));
  if (seccion) seccion.classList.add("mostrar");
  var actual = document.querySelector(".actual");
  if (actual) actual.classList.remove("actual");
  var tab = document.querySelector("[data-paso=\"".concat(paso, "\"]"));
  if (tab) tab.classList.add("actual");
}

function botonesPaginador() {
  var anterior = document.querySelector("#anterior"),
      siguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    anterior.classList.add("ocultar");
    siguiente.classList.remove("ocultar");
  } else if (paso === 3) {
    anterior.classList.remove("ocultar");
    siguiente.classList.add("ocultar");
    mostrarResumen();
  } else {
    anterior.classList.remove("ocultar");
    siguiente.classList.remove("ocultar");
  }

  mostrarSeccion();
}

function paginaAnterior() {
  document.querySelector("#anterior").addEventListener("click", function () {
    if (paso > 1) {
      paso--;
      botonesPaginador();
    }
  });
}

function paginaSiquiente() {
  document.querySelector("#siguiente").addEventListener("click", function () {
    if (paso < 3) {
      paso++;
      botonesPaginador();
    }
  });
}
/* --------------------------------------------- */

/*   CONSULTAR SERVICIOS                         */

/* --------------------------------------------- */


function consultarAPI() {
  var url, resp, texto, json;
  return regeneratorRuntime.async(function consultarAPI$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          url = "".concat(location.origin, "/api/servicios");
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(url));

        case 4:
          resp = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(resp.text());

        case 7:
          texto = _context.sent;
          console.log("Respuesta del servidor:", texto);

          try {
            json = JSON.parse(texto);
            mostrarServicios(json);
          } catch (error) {
            console.error("El servidor NO devolvió JSON válido", error);
            mostrarAlerta("Error en el servidor: La respuesta no es JSON válido", "error", ".formulario");
          }

          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.log("Error en la petición:", _context.t0);
          mostrarAlerta("No se pudo conectar con el servidor", "error", ".formulario");

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

function mostrarServicios(servicios) {
  servicios.forEach(function (servicio) {
    var id = servicio.id,
        nombre = servicio.nombre,
        precio = servicio.precio;
    var nombreP = document.createElement("P");
    nombreP.classList.add("nombre-servicio");
    nombreP.textContent = nombre;
    var precioP = document.createElement("P");
    precioP.classList.add("precio-servicio");
    precioP.textContent = "$ ".concat(precio);
    var div = document.createElement("DIV");
    div.classList.add("servicio");
    div.dataset.idServicio = id;

    div.onclick = function () {
      seleccionarServicio(servicio);
    };

    div.appendChild(nombreP);
    div.appendChild(precioP);
    document.querySelector("#servicios").appendChild(div);
  });
}

function seleccionarServicio(servicio) {
  var id = servicio.id;
  var servicios = cita.servicios;
  var div = document.querySelector("[data-id-servicio=\"".concat(id, "\"]"));

  if (servicios.some(function (s) {
    return s.id === id;
  })) {
    cita.servicios = servicios.filter(function (s) {
      return s.id !== id;
    });
    div.classList.remove("seleccionado");
  } else {
    cita.servicios = [].concat(_toConsumableArray(servicios), [servicio]);
    div.classList.add("seleccionado");
  }

  mostrarResumen();
}
/* --------------------------------------------- */

/*   DATOS DEL CLIENTE                           */

/* --------------------------------------------- */


function idCliente() {
  var input = document.querySelector("#id");
  cita.id = input.value;
  input.addEventListener("input", function (e) {
    cita.id = e.target.value;
  });
}

function nombreCliente() {
  var input = document.querySelector("#nombre");
  cita.nombre = input.value;
  input.addEventListener("input", function (e) {
    cita.nombre = e.target.value;
  });
}
/* --------------------------------------------- */

/*   FECHA Y HORA                                */

/* --------------------------------------------- */


function seleccionarFecha() {
  document.querySelector("#fecha").addEventListener("input", function (e) {
    var dia = new Date(e.target.value).getUTCDay();

    if ([6, 0].includes(dia)) {
      e.target.value = "";
      mostrarAlerta("Cerrado los fines de semana", "error", ".formulario");
    } else {
      cita.fecha = e.target.value;
    }

    mostrarResumen();
  });
}

function mostrarAlerta(msg, tipo, selector) {
  var desaparecer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) alertaPrevia.remove();
  var div = document.createElement("DIV");
  div.textContent = msg;
  div.classList.add("alerta", tipo);
  document.querySelector(selector).appendChild(div);

  if (desaparecer) {
    setTimeout(function () {
      return div.remove();
    }, 3000);
  }
}

function seleccionarHora() {
  document.querySelector("#hora").addEventListener("input", function (e) {
    var hora = parseInt(e.target.value.split(":")[0]);

    if (hora < 10 || hora > 18) {
      mostrarAlerta("Hora no válida (10 AM - 6 PM)", "error", ".formulario");
      e.target.value = "";
      cita.hora = "";
    } else {
      cita.hora = e.target.value;
    }

    mostrarResumen();
  });
}
/* --------------------------------------------- */

/*   RESUMEN                                     */

/* --------------------------------------------- */


function mostrarResumen() {
  var resumen = document.querySelector(".contenido-resumen");

  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta("Faltan datos por completar", "error", ".contenido-resumen", false);
    return;
  }

  var nombre = cita.nombre,
      fecha = cita.fecha,
      hora = cita.hora,
      servicios = cita.servicios;
  var h3 = document.createElement("H3");
  h3.textContent = "Resumen de Servicios";
  resumen.appendChild(h3);
  servicios.forEach(function (servicio) {
    var precio = servicio.precio,
        nombre = servicio.nombre;
    var div = document.createElement("DIV");
    div.classList.add("contenedor-servicio");
    var p1 = document.createElement("P");
    p1.textContent = nombre;
    var p2 = document.createElement("P");
    p2.innerHTML = "<span>Precio:</span> ".concat(precio);
    div.appendChild(p1);
    div.appendChild(p2);
    resumen.appendChild(div);
  });
  var hCliente = document.createElement("H3");
  hCliente.textContent = "Datos del Cliente";
  resumen.appendChild(hCliente);
  var pNombre = document.createElement("P");
  pNombre.innerHTML = "<span>Nombre:</span> ".concat(nombre);
  var fechaOriginal = new Date(fecha);
  var fechaFormateada = fechaOriginal.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  var pFecha = document.createElement("P");
  pFecha.innerHTML = "<span>Fecha:</span> ".concat(fechaFormateada);

  var _hora$split = hora.split(":"),
      _hora$split2 = _slicedToArray(_hora$split, 2),
      h = _hora$split2[0],
      m = _hora$split2[1];

  h = parseInt(h);
  var ampm = h >= 12 ? "PM" : "AM";
  h = h > 12 ? h - 12 : h;
  h = h === 0 ? 12 : h;
  var pHora = document.createElement("P");
  pHora.innerHTML = "<span>Hora:</span> ".concat(h, ":").concat(m, " ").concat(ampm);
  var btn = document.createElement("BUTTON");
  btn.classList.add("boton");
  btn.textContent = "Reservar Cita";
  btn.addEventListener("click", reservarCita);
  resumen.appendChild(pNombre);
  resumen.appendChild(pFecha);
  resumen.appendChild(pHora);
  resumen.appendChild(btn);
}
/* --------------------------------------------- */

/*   RESERVAR CITA                               */

/* --------------------------------------------- */


function reservarCita() {
  var fecha, hora, servicios, id, serviciosIds, formData, url, resp, texto, data;
  return regeneratorRuntime.async(function reservarCita$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          fecha = cita.fecha, hora = cita.hora, servicios = cita.servicios, id = cita.id;
          serviciosIds = servicios.map(function (s) {
            return s.id;
          });
          formData = new FormData();
          formData.append("fecha", fecha);
          formData.append("hora", hora);
          formData.append("usuarioId", id);
          formData.append("servicios", JSON.stringify(serviciosIds));
          _context2.prev = 7;
          url = "".concat(location.origin, "/api/citas");
          _context2.next = 11;
          return regeneratorRuntime.awrap(fetch(url, {
            method: "POST",
            body: formData
          }));

        case 11:
          resp = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(resp.text());

        case 14:
          texto = _context2.sent;
          console.log("Respuesta POST:", texto);
          data = JSON.parse(texto);

          if (data.resultado) {
            Swal.fire({
              icon: "success",
              title: "Cita registrada",
              text: "Tu cita fue creada correctamente",
              confirmButtonText: "OK"
            }).then(function () {
              window.location.reload();
            });
          }

          _context2.next = 24;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](7);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo reservar la cita"
          });
          console.log(_context2.t0);

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 20]]);
}
/* --------------------------------------------- */

/*   INICIO                                      */

/* --------------------------------------------- */


document.addEventListener("DOMContentLoaded", iniciarApp);
window.addEventListener("error", function (e) {
  if (e.filename && e.filename.includes("content_script.js")) {
    e.stopImmediatePropagation();
  }
});