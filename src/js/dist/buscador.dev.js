"use strict";

document.addEventListener('DOMContentLoaded', function () {
  iniciarApp();
});

function iniciarApp() {
  buscarPorFecha();
}

function buscarPorFecha() {
  var fechaInput = document.querySelector('#fecha');
  if (!fechaInput) return;
  fechaInput.addEventListener('input', function (e) {
    var fechaSeleccionada = e.target.value;
    window.location = "?fecha=".concat(fechaSeleccionada);
  });
}