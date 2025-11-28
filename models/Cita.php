<?php 

    namespace Model;

    class Cita extends ActiveRecord {
        // Configuracion base de datps

        protected static $tabla = 'citas';
        protected static$columnasDB = ['id', 'fecha', 'hora', 'usuarioId'];

        public $id;
        public $fecha;
        public $hora;
        public $usuarioId;

        public function __construct($args = [])
        {
            $this->id = $args['id'] ?? null;
            $this->fecha = $args['fecha'] ?? '';
            $this->hora = $args['hora'] ?? '';
            $this->usuarioId = $args['usuarioId'] ?? '';

        }

        public function eliminar() {

            $queryServicios = "DELETE FROM citasServicios WHERE citaId = " . self::$db->escape_string($this->id);
            self::$db->query($queryServicios);

            $query = "DELETE FROM citas WHERE id = " . self::$db->escape_string($this->id) . " LIMIT 1";
            return self::$db->query($query);
        }

    }


?>