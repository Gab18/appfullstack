<?php
namespace Model;

class ActiveRecord {

    // BASE DE DATOS
    protected static $db;
    protected static $tabla = '';
    protected static $columnasDB = [];

    // Alertas y Mensajes
    protected static $alertas = [];
    
    // Definir la conexión a la BD
    public static function setDB($database) {
        self::$db = $database;
    }

    public static function setAlerta($tipo, $mensaje) {
        static::$alertas[$tipo][] = $mensaje;
    }

    // Validación
    public static function getAlertas() {
        return static::$alertas;
    }

    public function validar() {
        static::$alertas = [];
        return static::$alertas;
    }

    // Consulta SQL para crear objetos en memoria
    public static function consultarSQL($query) {
        $resultado = self::$db->query($query);

        $array = [];
        while($registro = $resultado->fetch_assoc()) {
            $array[] = static::crearObjeto($registro);
        }

        $resultado->free();

        return $array;
    }

    // Crear objeto basado en la BD
    protected static function crearObjeto($registro) {
        $objeto = new static;

        foreach($registro as $key => $value ) {
            if(property_exists($objeto, $key)) {
                $objeto->$key = $value;
            }
        }

        return $objeto;
    }

    // Obtener atributos
    public function atributos() {
        $atributos = [];

        foreach(static::$columnasDB as $columna) {
            if($columna === 'id') continue;
            $atributos[$columna] = $this->$columna;
        }

        return $atributos;
    }

    // Sanitizar datos
    public function sanitizarAtributos() {
        $atributos = $this->atributos();
        $sanitizado = [];

        foreach($atributos as $key => $value ) {
            $sanitizado[$key] = self::$db->escape_string($value);
        }

        return $sanitizado;
    }

    // Sincronizar datos
    public function sincronizar($args = []) { 
        foreach($args as $key => $value) {
            if(property_exists($this, $key) && !is_null($value)) {
                $this->$key = $value;
            }
        }
    }

    // Guardar registro
    public function guardar() {
        if(!is_null($this->id)) {
            return $this->actualizar();
        } else {
            return $this->crear();
        }
    }

    // Obtener todos
    public static function all() {
        $query = "SELECT * FROM " . static::$tabla;
        return self::consultarSQL($query);
    }

    // Buscar por ID
    public static function find($id) {
        $query = "SELECT * FROM " . static::$tabla . " WHERE id = {$id}";
        $resultado = self::consultarSQL($query);
        return array_shift($resultado);
    }

    // Obtener límite
    public static function get($limite) {
        $query = "SELECT * FROM " . static::$tabla . " LIMIT {$limite}";
        $resultado = self::consultarSQL($query);
        return array_shift($resultado);
    }

    // Where
    public static function where($columna, $valor) {

        $columna = self::$db->escape_string($columna);
        $valor = self::$db->escape_string($valor);

        $query = "SELECT * FROM " . static::$tabla . " WHERE {$columna} = '{$valor}' LIMIT 1";
        $resultado = self::consultarSQL($query);

        return array_shift($resultado);
    }

        //CONSULTA PLANA DE SQL 
    public static function SQL($consulta) {

        $resultado = self::$db->query($consulta);

        $array = [];

        while($registro = $resultado->fetch_assoc()) {
            $array[] = static::crearObjeto($registro);
        }

        return $array;
    }


    // Crear registro
    public function crear() {

        $atributos = $this->sanitizarAtributos();

        $query = "INSERT INTO " . static::$tabla . " ( ";
        $query .= join(', ', array_keys($atributos));
        $query .= " ) VALUES ('";
        $query .= join("', '", array_values($atributos));
        $query .= "') ";

        $resultado = self::$db->query($query);
        return [
            'resultado' =>  $resultado,
            'id' => self::$db->insert_id
        ];
    }

    //Metodo para eliminar
    public function eliminar() {
        $query = "DELETE FROM " . static::$tabla . " WHERE id = " . self::$db->escape_string($this->id) . " LIMIT 1";
        $resultado = self::$db->query($query);

        if($resultado) {
            header('Location: /servicios');
        }
    }


    // Actualizar registro
    public function actualizar() {

        $atributos = $this->atributos();
        $valores = [];

        foreach($atributos as $key => $value) {

            if ($value === null) {
                $valores[] = "{$key}=NULL";
            } else {
                $value = self::$db->escape_string($value);
                $valores[] = "{$key}='{$value}'";
            }

        }

        $query = "UPDATE " . static::$tabla . " SET ";
        $query .= join(', ', $valores);
        $query .= " WHERE id = '" . self::$db->escape_string($this->id) . "' ";
        $query .= " LIMIT 1"; 

        return self::$db->query($query);
    }

}
