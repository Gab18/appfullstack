<p class="descripcion-pagina">Restablecer contraseña</p>

<?php 
include_once __DIR__ . "/../templates/alertas.php";
?>

<?php if($error)?>
<form action="/recuperar" class="formulario" method="POST">
    <input type="hidden" name="token" value="<?php echo $token; ?>">

    <div class="campo">
        <label for="password">Nueva contraseña</label>
        <input type="password" id="password" name="password" placeholder="Nueva contraseña">
    </div>

    <input type="submit" value="Restablecer contraseña" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? - Iniciar Sesión</a>
    <a href="/crear-cuenta">Crear cuenta - AppSalon</a>
</div>