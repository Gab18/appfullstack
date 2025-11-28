<?php 

namespace Controllers;

use Model\Servicio;
use MVC\Router;

    class   ServicioController{
        public static function index(Router $router){
            
            //Bloquea si no esta registrado
            // isAdmin();

            $servicios = Servicio::all();
            
            $router->render('servicios/index', [
                'nombre' => $_SESSION['nombre'],
                'servicios' => $servicios
            ]);
        }
        public static function crear(Router $router){
            
            //Bloquea si no esta registrado
            // isAdmin();

            $servicio = new Servicio;
            $alertas = [];

            if($_SERVER['REQUEST_METHOD'] === 'POST'){
                $servicio->sincronizar($_POST);
                $alertas = $servicio->validar();

                if(empty($alertas)){
                    $servicio->guardar();
                    header('location: /servicios');
                }
            }
            $router->render('servicios/crear', [
                'nombre' => $_SESSION['nombre'],
                'servicio' => $servicio,
                'alertas' => $alertas
            ]);
        }

    public static function actualizar(Router $router){

            //Bloquea si no esta registrado
            // isAdmin();

        // 1. Obtener el ID de la URL
        $id = $_GET['id'] ?? null;

        // 2. Validar que sea un número real
        if(!$id || !is_numeric($id)) {
            header('Location: /servicios');
            exit;
        }

        // 3. Buscar el servicio
        $servicio = Servicio::find($id);

        // Si no existe, redirigir
        if(!$servicio) {
            header('Location: /servicios');
            exit;
        }

        // 4. Alertas
        $alertas = [];

        // 5. Procesar formulario POST
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $servicio->sincronizar($_POST);
            $alertas = $servicio->validar();

            if(empty($alertas)){
                $servicio->guardar();
                header('Location: /servicios');
                exit;
            }
        }

        // 6. Renderizar la vista
        $router->render('servicios/actualizar', [
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }

    public static function eliminar() {

            //Bloquea si no esta registrado
            // isAdmin();

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

            $id = $_POST['id'];
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if($id) {
                $servicio = Servicio::find($id);

                if($servicio) {
                    $servicio->eliminar();
                }
            }

            header('Location: /servicios');
        }
    }

    }
?>
