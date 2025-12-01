let paso = 1;
const pasoInicial = 1,
      pasoFinal = 3;

const cita = {
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
    document.querySelectorAll(".tabs button").forEach(boton => {
        boton.addEventListener("click", function(e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        });
    });
}

function mostrarSeccion() {
    document.querySelectorAll(".seccion").forEach(sec => sec.classList.remove("mostrar"));

    const seccion = document.querySelector(`#paso-${paso}`);
    if (seccion) seccion.classList.add("mostrar");

    const actual = document.querySelector(".actual");
    if (actual) actual.classList.remove("actual");

    const tab = document.querySelector(`[data-paso="${paso}"]`);
    if (tab) tab.classList.add("actual");
}

function botonesPaginador() {
    const anterior = document.querySelector("#anterior"),
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
    document.querySelector("#anterior").addEventListener("click", function() {
        if (paso > 1) {
            paso--;
            botonesPaginador();
        }
    });
}

function paginaSiquiente() {
    document.querySelector("#siguiente").addEventListener("click", function() {
        if (paso < 3) {
            paso++;
            botonesPaginador();
        }
    });
}

/* --------------------------------------------- */
/*   CONSULTAR SERVICIOS                         */
/* --------------------------------------------- */

async function consultarAPI() {
    try {
        const url = `${location.origin}/api/servicios`;
        const resp = await fetch(url);

        const texto = await resp.text();
        console.log("Respuesta del servidor:", texto);

        try {
            const json = JSON.parse(texto);
            mostrarServicios(json);
        } catch (error) {
            console.error("El servidor NO devolvió JSON válido", error);
            mostrarAlerta(
                "Error en el servidor: La respuesta no es JSON válido",
                "error",
                ".formulario"
            );
        }

    } catch (error) {
        console.log("Error en la petición:", error);
        mostrarAlerta("No se pudo conectar con el servidor", "error", ".formulario");
    }
}

function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const { id, nombre, precio } = servicio;

        const nombreP = document.createElement("P");
        nombreP.classList.add("nombre-servicio");
        nombreP.textContent = nombre;

        const precioP = document.createElement("P");
        precioP.classList.add("precio-servicio");
        precioP.textContent = `$ ${precio}`;

        const div = document.createElement("DIV");
        div.classList.add("servicio");
        div.dataset.idServicio = id;
        div.onclick = function() {
            seleccionarServicio(servicio);
        };

        div.appendChild(nombreP);
        div.appendChild(precioP);

        document.querySelector("#servicios").appendChild(div);
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;
    const div = document.querySelector(`[data-id-servicio="${id}"]`);

    if (servicios.some(s => s.id === id)) {
        cita.servicios = servicios.filter(s => s.id !== id);
        div.classList.remove("seleccionado");
    } else {
        cita.servicios = [...servicios, servicio];
        div.classList.add("seleccionado");
    }

    mostrarResumen();
}

/* --------------------------------------------- */
/*   DATOS DEL CLIENTE                           */
/* --------------------------------------------- */

function idCliente() {
    const input = document.querySelector("#id");
    cita.id = input.value;

    input.addEventListener("input", e => {
        cita.id = e.target.value;
    });
}

function nombreCliente() {
    const input = document.querySelector("#nombre");
    cita.nombre = input.value;

    input.addEventListener("input", e => {
        cita.nombre = e.target.value;
    });
}

/* --------------------------------------------- */
/*   FECHA Y HORA                                */
/* --------------------------------------------- */

function seleccionarFecha() {
    document.querySelector("#fecha").addEventListener("input", function(e) {
        const dia = new Date(e.target.value).getUTCDay();

        if ([6, 0].includes(dia)) {
            e.target.value = "";
            mostrarAlerta("Cerrado los fines de semana", "error", ".formulario");
        } else {
            cita.fecha = e.target.value;
        }

        mostrarResumen();
    });
}

function mostrarAlerta(msg, tipo, selector, desaparecer = true) {
    const alertaPrevia = document.querySelector(".alerta");
    if (alertaPrevia) alertaPrevia.remove();

    const div = document.createElement("DIV");
    div.textContent = msg;
    div.classList.add("alerta", tipo);
    document.querySelector(selector).appendChild(div);

    if (desaparecer) {
        setTimeout(() => div.remove(), 3000);
    }
}

function seleccionarHora() {
    document.querySelector("#hora").addEventListener("input", function(e) {
        const hora = parseInt(e.target.value.split(":")[0]);

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
    const resumen = document.querySelector(".contenido-resumen");

    while (resumen.firstChild) resumen.removeChild(resumen.firstChild);

    if (Object.values(cita).includes("") || cita.servicios.length === 0) {
        mostrarAlerta("Faltan datos por completar", "error", ".contenido-resumen", false);
        return;
    }

    const { nombre, fecha, hora, servicios } = cita;

    const h3 = document.createElement("H3");
    h3.textContent = "Resumen de Servicios";
    resumen.appendChild(h3);

    servicios.forEach(servicio => {
        const { precio, nombre } = servicio;

        const div = document.createElement("DIV");
        div.classList.add("contenedor-servicio");

        const p1 = document.createElement("P");
        p1.textContent = nombre;

        const p2 = document.createElement("P");
        p2.innerHTML = `<span>Precio:</span> ${precio}`;

        div.appendChild(p1);
        div.appendChild(p2);
        resumen.appendChild(div);
    });

    const hCliente = document.createElement("H3");
    hCliente.textContent = "Datos del Cliente";
    resumen.appendChild(hCliente);

    const pNombre = document.createElement("P");
    pNombre.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaOriginal = new Date(fecha);
    const fechaFormateada = fechaOriginal.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const pFecha = document.createElement("P");
    pFecha.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    let [h, m] = hora.split(":");
    h = parseInt(h);

    const ampm = h >= 12 ? "PM" : "AM";
    h = h > 12 ? h - 12 : h;
    h = h === 0 ? 12 : h;

    const pHora = document.createElement("P");
    pHora.innerHTML = `<span>Hora:</span> ${h}:${m} ${ampm}`;

    const btn = document.createElement("BUTTON");
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

async function reservarCita() {
    const { fecha, hora, servicios, id } = cita;
    const serviciosIds = servicios.map(s => s.id);

    const formData = new FormData();
    formData.append("fecha", fecha);
    formData.append("hora", hora);
    formData.append("usuarioId", id);
    formData.append("servicios", JSON.stringify(serviciosIds));

    try {
        const url = `${location.origin}/api/citas`;
        const resp = await fetch(url, {
            method: "POST",
            body: formData
        });

        const texto = await resp.text();
        console.log("Respuesta POST:", texto);

        const data = JSON.parse(texto);

        if (data.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita registrada",
                text: "Tu cita fue creada correctamente",
                confirmButtonText: "OK"
            }).then(() => {
                window.location.reload();
            });
        }

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo reservar la cita"
        });
        console.log(error);
    }
}

/* --------------------------------------------- */
/*   INICIO                                      */
/* --------------------------------------------- */

document.addEventListener("DOMContentLoaded", iniciarApp);

window.addEventListener("error", function(e) {
    if (e.filename && e.filename.includes("content_script.js")) {
        e.stopImmediatePropagation();
    }
});
