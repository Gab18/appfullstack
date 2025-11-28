<?php 
// Forzar que siempre sea un array
if(!is_array($alertas)) {
    $alertas = [
        'error' => [$alertas]
    ];
}
?>

<?php if(!empty($alertas)): ?>
    <div class="alertas">
        <?php foreach($alertas as $tipo => $mensajes): ?>
            <?php 
                // Asegurar que los mensajes también sean array
                if(!is_array($mensajes)) {
                    $mensajes = [$mensajes];
                }
            ?>
            <?php foreach($mensajes as $mensaje): ?>
                <div class="alerta <?php echo $tipo; ?>">
                    <?php echo $mensaje; ?>
                </div>
            <?php endforeach; ?>
        <?php endforeach; ?>
    </div>
<?php endif; ?>
