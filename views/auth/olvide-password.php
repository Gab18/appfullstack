<h1 class="nombre-pagina">Recuperar contraseña</h1>
<p class="descripcion-pagina">Restablecer contraseña</p>

<?php 
include_once __DIR__ . "/../templates/alertas.php";
?>

<form action="/olvide" class="formulario" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Tu email">
    </div>
    <input type="submit" value="Restablecer contraseña" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? - Iniciar Sesión</a>
    <a href="/crear-cuenta">Crear cuenta - AppSalon</a>
</div>