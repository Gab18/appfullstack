<?php

namespace Controllers;

use Classes\Email;
use MVC\Router;
use Model\Usuario;

class LoginController {

    public static function login(Router $router){
        $alertas = [];

        $auth = new Usuario;

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarLogin();

            if(empty($alertas)){

                $auth->email = trim(strtolower($auth->email)); // ✅ FIX

                $usuario = Usuario::where('email', $auth->email);

                if($usuario){
                    if($usuario->comprobarPasswordAndVerificado($auth->password)){

                        if(session_status() !== PHP_SESSION_ACTIVE){
                            session_start();
                        }

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido; 
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;
                        $_SESSION['admin'] = $usuario->admin;

                        if((int)$usuario->admin === 1){
                            header('Location: /admin');
                        } else {
                            header('Location: /cita');
                        }

                        exit;

                    } else {
                        Usuario::setAlerta('error', 'Password incorrecto o cuenta no verificada');
                    }
                } else {
                    Usuario::setAlerta('error', 'Usuario no encontrado');
                }
            }
        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/login', [
        'alertas' => $alertas,
        'auth' => $auth
    ]);

    }

    public static function logout(){
        session_start();
        $_SESSION = [];
        header('Location: /');
    }

    public static function olvide(Router $router){

        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === 'POST' ){

            $auth = new Usuario($_POST);
            $alertas = $auth->validarEmail(); 

            if(empty($alertas)){
                $usuario = Usuario::where('email', $auth->email);

                if($usuario && $usuario->confirmado === "1"){
                    //Generar token
                    $usuario->generarToken();
                    $usuario->guardar();
                    //Enviar email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();
                    //Alerta de exito
                    Usuario::setAlerta('exito', 'Correo enviado exitosamente');
                    Usuario::getAlertas();

                }else{
                    Usuario::setAlerta('error', 'El Usuario no existe' );
                };
            }

        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/olvide-password', [
            'alertas' => $alertas
        ]);
    }

    public static function recuperar(Router $router){

        $alertas = [];
        $error = false;

        $token = s($_GET['token'] ?? $_POST['token'] ?? '');

        // Buscar usuario
        $usuario = Usuario::where('token', $token);

        if(!$usuario){
            Usuario::setAlerta('error', 'Token no válido');
            $error = true;
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST' && !$error){

            $password = new Usuario($_POST);
            $alertas = $password->validarPassword();

            if(empty($alertas)) {
                $usuario->password = $password->password;
                $usuario->hashPassword();
                $usuario->token = null;
                $resultado = $usuario->guardar();

                if($resultado) {
                    header('Location: /');
                }

                Usuario::setAlerta('exito', 'Contraseña actualizada correctamente');
            }
        }

        $router->render('auth/recuperar', [
            'alertas' => Usuario::getAlertas(),
            'error' => $error,
            'token' => $token
        ]);
    }


    public static function crear(Router $router){
        
        $usuario = new Usuario;

        // Alertas
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

            $usuario->sincronizar($_POST);

            $alertas = validarNuevaCuenta($usuario);

            // Revisar alerta esté vacía
            if(empty($alertas)) {
                
                // Verificar usuario no esté registrado
                $resultado = $usuario->existeUsuario();

                if($resultado->num_rows){
                    $alertas = Usuario::getAlertas();
                } else {

                    // Hash password
                    $usuario->hashPassword();

                    // Generar token
                    $usuario->generarToken();

                    // Enviar email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarConfirmacion();

                    // Crear usuario
                    $resultado = $usuario->guardar();

                    if($resultado){
                        header('Location: /mensaje');
                        exit;
                    }
                }
            }
        }

        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function mensaje(Router $router){
        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router) {
        
        if (!isset($_GET['token']) || empty($_GET['token'])) {
            Usuario::setAlerta('error', 'Token no válido');

            $router->render('auth/confirmar-cuenta', [
                'alertas' => Usuario::getAlertas()
            ]);
            return;
        }

        $token = s(trim($_GET['token']));

        $usuario = Usuario::where('token', $token);

        if (!$usuario) {
            Usuario::setAlerta('error', 'Token no válido');
        } else {

            // Cambiar valores
            $usuario->confirmado = 1;
            $usuario->token = null;
            $usuario->guardar();

            Usuario::setAlerta('exito', 'Cuenta verificada correctamente');
        }

        $router->render('auth/confirmar-cuenta', [
            'alertas' => Usuario::getAlertas()
        ]);
    }

}