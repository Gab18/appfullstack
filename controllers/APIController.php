<?PHP 
    namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

    class APIController{
        public static function index(){
            $servicios = Servicio::all();

            echo json_encode($servicios);
        }

    public static function guardar() {

        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        if(!$resultado['resultado']) {
            echo json_encode(['resultado' => false]);
            return;
        }

        $id = $resultado['id'];

        // IMPORTANTE: servicios viene como JSON
        $idServicios = json_decode($_POST['servicios']);

        foreach($idServicios as $idServicio){
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];

            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        echo json_encode([
            'resultado' => true,
            'citaId' => $id
        ]);
    }

    public static function eliminar(){
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }

}

?>