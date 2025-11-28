<h1 class="nombre-pagina">Actualizar Servicios</h1>
<p class="descripcion-pagina">Modificar los valores del campo</p>

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

<form method="POST" class="formulario">
        <?php 
            include __DIR__ . '/formulario.php';
        ?>
    <input type="submit" class="boton" value="Actualizar Servicio">
</form>
