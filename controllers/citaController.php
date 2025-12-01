<?php 

namespace Controllers;

use MVC\Router;

class citaController {
    public static function index(Router $router) {

        // Si no hay sesión iniciada o no hay usuario, redirige
        if(!isset($_SESSION['login'])) {
            header('Location: /');
            exit;
        }

        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}
