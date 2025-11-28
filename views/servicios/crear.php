<h1 class="nombre-pagina">Crear Nuevo Servicios</h1>
<p class="descripcion-pagina">Completa los campos</p>

<?php
    include __DIR__ . '/../templates/barra.php';
    include __DIR__ . '/../templates/alertas.php';
?>

<?php 
    if(isset($_SESSION['admin'])){?>
        <div class="barra-servicios">
            <a class="boton" href="/admin">Ver Citas</a>
            <a class="boton" href="/servicios">Ver Servicios</a>
            <a class="boton" href="/servicios/crear">Nuevo Servicios</a>
        </div>

<?php } ?>


<form action="/servicios/crear" method="POST" class="formulario">
        <?php 
            include __DIR__ . '/formulario.php';
        ?>

    <input type="submit" class="boton" value="Guardar Servicio">
</form>