<?php
    namespace Model;

    use Model\ActiveRecord;

    class Servicio extends ActiveRecord{
        protected static $tabla = 'servicios';
        protected static $columnasDB = ['id', 'nombre', 'precio'];

        public $id;
        public $nombre;
        public $precio;

        public function __construct(){
            $this->id = $args['id'] ?? null;
            $this->nombre = $args['nombre'] ?? '';
            $this->precio = $args['precio'] ?? '';        
        }

        public function validar(){
            if(!$this->nombre){
                self::$alertas['error'] = 'El Nombre Del Servicio Es Obligatorio';
            }
            if(!$this->precio){
                self::$alertas['error'] = 'El Precio Del Servicio Es Obligatorio';
            }
            if(!is_numeric($this->precio)){
                self::$alertas['error'] = 'El Precio no es Valido';
            }
            return self::$alertas;
        }
    }
?>