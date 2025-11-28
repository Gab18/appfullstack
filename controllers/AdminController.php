<?php 

namespace Controllers;

use MVC\Router;
use Model\AdminCita;

class AdminController {

    public static function index(Router $router) {

        // isAdmin();

        $nombre = $_SESSION['nombre'] ?? 'Admin';

        $fecha = $_GET['fecha'] ?? date('Y-m-d');
        $fechas = explode('-', $fecha);

        if( !checkdate($fechas[1], $fechas[2], $fechas[0])) {
            header('Location: /404');
        }

        $consulta = "SELECT citas.id, citas.fecha, citas.hora,
        CONCAT(usuarios.nombre, ' ', usuarios.apellido) AS cliente,
        usuarios.email,
        usuarios.telefono,
        servicios.nombre AS servicio,
        servicios.precio
        FROM citas
        LEFT JOIN usuarios
        ON citas.usuarioId = usuarios.id
        LEFT JOIN citasServicios
        ON citasServicios.citaId = citas.id
        LEFT JOIN servicios
        ON servicios.id = citasServicios.servicioId
        WHERE citas.fecha = '$fecha'
        ORDER BY citas.hora";


        // Ejecutar consulta
        $citas = AdminCita::SQL($consulta);
        $router->render('admin/index', [
            'nombre' => $nombre,
            'citas' => $citas,
            'fechas' =>$fecha
        ]);
    }
}
