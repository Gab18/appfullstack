<h1 class="nombre-pagina">Login</h1>
<p class="descripcion-pagina">Iniciar Sesión</p>

<?php include_once __DIR__ . '/../templates/alertas.php'?>


<form class="formulario" action="/" method="POST">
    <div class="campo">
    <label for="email">Email</label>
    <input type="text" type="email" id="email" placeholder="Tu correo" name="email" value="<?php echo s($auth->email); ?>">
    </div>

    <div class="campo">
    <label for="password">Password</label>
    <input type="password" id="password" placeholder="Password" name="password">
    </div>
    <input type="submit" class="boton" value="Iniciar Sesión">
</form>

<div class="acciones">
    <a href="/crear-cuenta">Crear cuenta Nueva - AppMultifuncional</a>
    <a href="/olvide">¿Has olvidado tu contraseña?</a>
</div>

<footer class="footer-dev-mini">
    <small>Sistema desarrollado por <strong><?php echo $empresaDesarrolladora ?? 'SOFTARTHUR - Gabriel Arthur'; ?></strong></small>
</footer>


