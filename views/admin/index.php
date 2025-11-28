<h1 class="nombre-pagina">Panel de Administración</h1>

<div class="barra">
    <p>Hola: <?php echo $nombre ?? ''?></p>
    <a href="/logout" class="boton">Cerrar Sesión</a>
</div>

<?php 
    if(isset($_SESSION['admin'])){?>
        <div class="barra-servicios">
            <a class="boton" href="/admin">Ver Citas</a>
            <a class="boton" href="/servicios">Ver Servicios</a>
            <a class="boton" href="/servicios/crear">Nuevo Servicios</a>
        </div>

<?php } ?>


<div class="busqueda">
    <h2>Buscar Citas</h2>
    <form action="" class="formulario">
        <div class="campo">
            <label for="fecha">Fecha:</label>
            <input type="date" id="fecha" name="fecha" value="<?php echo $fecha?>">
        </div>
    </form>
</div>

<?php 
if(count($citas) === 0 ) {
    echo "<h2>Citas No Disponible</h2>";
}
?>

<div id="citas-admin">
    <ul class="citas">
        <?php 
            $idCita = 0;

            foreach($citas as $key => $cita):

                if($idCita !== $cita->id): 
                    $total = 0;
        ?>
        <li>
            <p>ID: <span><?php echo $cita->id;?></span></p>
            <p>Hora: <span><?php echo $cita->hora;?></span></p>
            <p>Cliente: <span><?php echo $cita->cliente;?></span></p>
            <p>Email: <span><?php echo $cita->email;?></span></p>
            <p>Teléfono: <span><?php echo $cita->telefono;?></span></p>

            <h3>Servicios</h3>

            <?php 
                $idCita = $cita->id;
                endif;

                $total += $cita->precio;
            ?>

            <p class="servicio">
                <?php echo $cita->servicio . " - RD$ " . $cita->precio; ?>
            </p>

            <?php 
                $actual = $cita->id;
                $proximo = $citas[$key + 1]->id ?? 0;

                // solo corregí el typo aquí
                if(esUltimo($actual, $proximo)){ ?>
                    <p class="total">Total: <span>RD$ <?php echo $total;?></span></p>
                <?php } ?>

                <?php if(esUltimo($actual, $proximo)): ?>
                    <form action="/api/eliminar" method="POST">
                        <input type="hidden" name="id" value="<?php echo $cita->id;?>" >
                        <input type="submit" class="boton-eliminar" value="Eliminar" >
                    </form>
                <?php endif; ?>

            <?php 
            // Solo cerramos el LI cuando cambia la cita o es la última
            if(!isset($citas[$key + 1]) || $citas[$key + 1]->id !== $cita->id):
            ?>
                </li>
            <?php endif; ?>

        <?php endforeach; ?>

    </ul>
</div>

<?php 
$script = "<script src='build/js/buscador.js'></script>";
?>
