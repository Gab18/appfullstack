<h1 class="nombre-pagina">Crear Cuenta</h1>
<p class="descripcion-pagina">Completa formulario para crear una cuenta</p>

<?php 

include_once __DIR__ . "/../templates/alertas.php";

?>

<form action="/crear-cuenta" class="formulario" method="POST">
    <div class="campo">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" value="<?= s($usuario->nombre); ?>">
    </div>

    <div class="campo">
        <label for="apellido">Apellido</label>
        <input type="text" id="apellido" name="apellido" placeholder="Tu apellido" value="<?= s($usuario->apellido) ?>">
    </div>

    <div class="campo">
        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" name="telefono" placeholder="Teléfono" value="<?= s($usuario->telefono) ?>">
    </div>

    <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Tu email" value="<?=  s($usuario->email) ?>">
    </div>

    <div class="campo">
        <label for="password">Contraseña</label>
        <input type="password" id="password" name="password" placeholder="Tu contraseña" value="<?= s($usuario->password) ?>">
    </div>

    <input type="submit" value="Crear cuenta" class="boton">

</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? - Iniciar Sesión</a>
    <a href="/olvide">¿Has olvidado tu contraseña? </a>
</div>