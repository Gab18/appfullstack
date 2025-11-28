let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios:[] 
};

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
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

window.addEventListener("error", function(e) {
    if (e.filename && e.filename.includes("content_script.js")) {
        e.stopImmediatePropagation();
    }
});

function tabs(){
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => {
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        });
    });
}

function mostrarSeccion() {
    document.querySelectorAll('.seccion').forEach(sec => {
        sec.classList.remove('mostrar');
    });

    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);

    if(seccion) {
        seccion.classList.add('mostrar');
    }

    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    const tab = document.querySelector(`[data-paso="${paso}"]`);
    if(tab) tab.classList.add('actual');
}

function botonesPaginador(){

    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiquiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiquiente.classList.remove('ocultar');

    } else if(paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiquiente.classList.add('ocultar');

        mostrarResumen();

    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiquiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');

    paginaAnterior.addEventListener('click', function(){
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}

function paginaSiquiente(){
    const paginaSiquiente = document.querySelector('#siguiente');

    paginaSiquiente.addEventListener('click', function(){
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    });
}

async function consultarAPI(){
    try{
        const url = '${location.origin}/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    }catch(error){
        console.log(error);
    }
}

function mostrarServicios(servicios){

    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$ ${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;

        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios} = cita;

    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    if(servicios.some(agregado => agregado.id === id )) {  
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    }else{
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }

    mostrarResumen();
}

function idCliente(){
    const inputId = document.querySelector('#id');

    cita.id = inputId.value;

    inputId.addEventListener('input', function(e){
        cita.id = e.target.value;
    });
}

function nombreCliente(){
    const inputNombre = document.querySelector('#nombre');

    cita.nombre = inputNombre.value;

    inputNombre.addEventListener('input', function(e){
        cita.nombre = e.target.value;
    });
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');

    inputFecha.addEventListener('input', function(e){

        const dia = new Date(e.target.value).getUTCDay();

        if([6, 0].includes(dia)){
            e.target.value = '';
            mostrarAlerta('Cerrado los fines de semana', 'error', '.formulario');
        }else{
            cita.fecha = e.target.value;
        }

        mostrarResumen();
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true ){

    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    };

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta', tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece){
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', function(e){
        const hora = e.target.value.split(':')[0];

        if(hora < 10 || hora > 18){
            mostrarAlerta('Hora no válida (10 AM - 6 PM)', 'error', '.formulario');
            e.target.value = '';
            cita.hora = '';
        }else{
            cita.hora = e.target.value;
        }

        mostrarResumen();
    });
}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');

    //limpiar contenido 
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Faltan datos por completar', 'error', '.contenido-resumen', false)
        return;
    }

    if(!resumen) return;

    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Faltan datos por completar', 'error', '.contenido-resumen', false)
        return;
    }

    const {nombre, fecha, hora, servicios} = cita;

    //Headind de servicios

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    //Iterar servicios
    servicios.forEach(servicio => {
        const { precio, nombre } = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> ${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    //Heading Datos del cliente
    const headingCliente = document.createElement('H3');
    headingCliente.textContent = 'Datos del Cliente';
    resumen.appendChild(headingCliente);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    //Formatear fecha

    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));
    const opciones = {weekday: 'long', year: 'numeric', month:'long', day: 'numeric'};
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const [h, m] = hora.split(':');

    let horaNum = parseInt(h);
    let sufijo = horaNum >= 12 ? 'PM' : 'AM';

    horaNum = horaNum > 12 ? horaNum - 12 : horaNum;
    horaNum = horaNum === 0 ? 12 : horaNum; // para las 12 AM

    const horaFormateada = `${horaNum}:${m} ${sufijo}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${horaFormateada}`;

    //Reservar boton
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = ('Reservar Cita');

    botonReservar.addEventListener('click', reservarCita);



    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}


async function reservarCita() {
    const { nombre, fecha, hora, servicios, id } = cita;

    const idServicios = servicios.map(servicio => servicio.id);

    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', JSON.stringify(idServicios)); // IMPORTANTE

    try {
        const url = '${location.origin}/api/citas';

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();

        if(resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita registrada',
                text: 'Tu cita fue creada correctamente',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload();
            });
        }

    } catch(error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo reservar la cita'
        });
        console.log(error);
    }
}

