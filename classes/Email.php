<?php 

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Email {
    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion() {

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = $_ENV['EMAIL_HOST'];
            $mail->SMTPAuth = true;
            $mail->Port = $_ENV['EMAIL_PORT'];
            $mail->Username = $_ENV['EMAIL_USER'];
            $mail->Password = $_ENV['EMAIL_PASS'];

            $mail->setFrom('cuentas@appsalon.com', 'AppSalon');
            $mail->addAddress($this->email, $this->nombre);

            $mail->isHTML(true);
            $mail->Subject = 'Confirma tu cuenta - AppSalon';

            $contenido  = "<html>";
            $contenido .= "<p>Hola <strong>{$this->nombre}</strong>,</p>";
            $contenido .= "<p>Has creado una cuenta en AppSalon, confirma tu correo haciendo click en el siguiente enlace:</p>";
            $contenido .= "<p><a href='" . $_ENV['APP_URL'] . "/confirmar-cuenta?token={$this->token}'>Confirmar Cuenta</a></p>";
            $contenido .= "<p>Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p>";
            $contenido .= "</html>";

            $mail->Body = $contenido;
            $mail->AltBody = "Confirma tu cuenta aquí: http://localhost:8000/confirmar-cuenta?token={$this->token}";

            $mail->send();

        } catch (Exception $e) {
            echo "Error al enviar email: {$mail->ErrorInfo}";
        }
    }

    public function enviarInstrucciones(){

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = $_ENV['EMAIL_HOST'];
            $mail->SMTPAuth = true;
            $mail->Port = $_ENV['EMAIL_PORT'];
            $mail->Username = $_ENV['EMAIL_USER'];
            $mail->Password = $_ENV['EMAIL_PASS'];

            $mail->setFrom('cuentas@appsalon.com', 'AppSalon');
            $mail->addAddress($this->email, $this->nombre);

            $mail->isHTML(true);
            $mail->Subject = 'Restablece tu Contraseña - AppSalon';

            $contenido  = "<html>";
            $contenido .= "<p>Hola <strong>{$this->nombre}</strong>,</p>";
            $contenido .= "<p>Has solicitado en restablecer tu contraseña de AppSalon, sigue el siguiente enlace:</p>";
            $contenido .=  "<p><a href='" . $_ENV['APP_URL'] . "/recuperar?token={$this->token}'>Restablecer contraseña</a></p>";
            $contenido .= "<p>Si no solicitaste restablecer contraseña, puedes ignorar este mensaje.</p>";
            $contenido .= "</html>";

            $mail->Body = $contenido;
            $mail->AltBody = "Restablece tu contraseña aquí: http://localhost:8000/recuperar?token={$this->token}";

            $mail->send();

        } catch (Exception $e) {
            echo "Error al enviar email: {$mail->ErrorInfo}";
        }
    }
}
?>
