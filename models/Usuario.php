<?php 

namespace Model;

use Classes\Email;

class Usuario extends ActiveRecord {

    // Base de datos
    protected static $tabla = 'usuarios';
    protected static $columnasDB = [
        'id', 
        'nombre', 
        'apellido', 
        'email', 
        'password', 
        'telefono', 
        'admin', 
        'confirmado', 
        'token'
    ];

    // Propiedades
    public $id;
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    public $telefono;
    public $admin;
    public $confirmado;
    public $token;

    // Constructor
    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido = $args['apellido'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->admin = $args['admin'] ?? 0;
        $this->confirmado = $args['confirmado'] ?? 0;
        $this->token = $args['token'] ?? '';
    }

    //Mensaje de validacion - crear cuenta

    public function validarNuevaCuenta() {
        if(!$this->nombre){
            self::$alertas['error'] [] = 'Nombre es obligatorio';
        }

        if(!$this->apellido){
            self::$alertas['error'] [] = 'Apellido es obligatorio';
        }

        if(!$this->email){
            self::$alertas['error'] [] = 'Email es obligatorio';
        }

        if(!$this->password){
            self::$alertas['error'] [] = 'Contraseña es obligatorio';
        }

        if(!$this->telefono){
            self::$alertas['error'] [] = 'Telefono es obligatorio';
        }

        if(strlen($this->password) < 6) {
                self::$alertas['error'] [] = ' La contraseña debe contener al menos 6 caracteres';

        }


        return self::$alertas;
    }

    public function validarLogin() {
        if(!$this->email){
            self::$alertas['error'] [] = 'El Correo es obligatorio';
        }
        
        if(!$this->password){
            self::$alertas['error'] [] = 'La Contraseña es obligatorio';
        }

        return self::$alertas;
    }

    public function validarEmail(){
        if(!$this->email){
            self::$alertas['error'] [] = 'El Correo es obligatorio';
        }  
        return self::$alertas;
    }

    public function validarPassword(){
        if(!$this->password){
            self::$alertas['error'][] = 'La Contraseńa es obligatoria';
        }
        if(strlen($this->password) < 6) {
            self::$alertas['error'] [] = 'La Contraseña debe de tener al menos 6 caracteres';
        }

        return self::$alertas;  
    }

    public function existeUsuario() {
        $email = self::$db->escape_string($this->email);

        $query = "SELECT * FROM " . self::$tabla . " WHERE email = '" . $this->email . "' LIMIT 1 ";

        $resultado = self::$db->query($query);

        if($resultado->num_rows){
            self::$alertas['error'][] = 'El usuario ya está registrado';
        }

        return $resultado;
    }


    public function hashPassword(){
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }


public function generarToken(){
    $this->token = uniqid();

    // Enviar el email
    $email = new Email($this->email, $this->nombre, $this->token);
    $email->enviarConfirmacion();
    }
    public function comprobarPasswordAndVerificado($password) {

        // Forzar a entero antes de evaluar
        $this->confirmado = (int) $this->confirmado;

        // Revisar si el usuario está confirmado
        if($this->confirmado !== 1){
            self::$alertas['error'][] = "Tu cuenta aún no ha sido confirmada.";
            return false;
        }

        // Limpiar password por si viene con espacios
        $password = trim($password);

        // Verificar contraseña
        $resultado = password_verify($password, $this->password);

        if(!$resultado){
            self::$alertas['error'][] = "Contraseña incorrecta.";
            return false;
        }

        return true;
    }



}

