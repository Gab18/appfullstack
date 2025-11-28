<div class="barra">
    <p>Hola: <?php echo $nombre ?? ''?></p>

    <a href="/logout" class="boton">Cerrar Sesión</a>
</div>

<h1 class="nombre-pagina">Agendar nueva cita</h1>
<p class="descripcion-pagina">Selecciona lo que deseas reservar </p>


<div class="" id="app">

    <nav class="tabs">
        <button class="actual" type="button" data-paso="1">Servicios</button>
        <button type="button" data-paso="2">información Cita</button>
        <button type="button" data-paso="3">Resumen</button>

    </nav>
    <div id="paso-1" class="seccion">
        <h2>Servicios</h2>
        <p class="text-center">¿Qué servicio necesitas?</p>
        <div id="servicios" class="listado-servicios"></div>
    </div>
    <div id="paso-2" class="seccion">
        <h2>Datos del cliente</h2>
        <p class="text-center">Completa formulario con tus datos</p>
        <form action="" class="formulario">
            <div class="campo">
                <label for="nomnre">Nombre:</label>
                <input id="nombre" type="text" placeholder="Tu Nombre" value="<?php echo $nombre?>" readonly>
            </div>
            <div class="campo">
                <label for="fecha">Fecha:</label>
                <input id="fecha" type="date" min="2025-11-01" min="<?php echo date('Y-m-d') ?>">
            </div>
            <div class="campo">
                <label for="hora">Hora:</label>
                <input id="hora" type="time">
            </div>

            <input type="hidden" id="id" value="<?php echo $id;?>">
        </form>
    </div>
    <div id="paso-3" class="seccion contenido-resumen">
        <h2>Resumen</h2>
        <p class="text-center">Verifica que la información sea correcta</p>
    </div>

    <div class="paginacion">
        <button id="anterior" class="boton">&laquo; Anterior</button>
        <button id="siguiente" class="boton">Siguiente &raquo;</button>

    </div>
</div>

<?php 
    $script = '
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script src="build/js/app.js"></script>
    ';

?>