<?php
// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "clinica_dental";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Recoger y sanitizar datos del formulario

// Verificar si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger y sanitizar datos del formulario
    $nombre = $conn->real_escape_string($_POST['nombre']);
    $email = $conn->real_escape_string($_POST['email']);
    $telefono = $conn->real_escape_string($_POST['telefono']);
    $fecha_nacimiento = $conn->real_escape_string($_POST['fecha_nacimiento']);
    $fecha_cita = $conn->real_escape_string($_POST['fecha_cita']);
    $motivo = $conn->real_escape_string($_POST['motivo']);

    // Insertar paciente
    $sql_paciente = "INSERT INTO pacientes (nombre, email, telefono, fecha_nacimiento) 
                     VALUES ('$nombre', '$email', '$telefono', '$fecha_nacimiento')";

    if ($conn->query($sql_paciente) === TRUE) {
        $paciente_id = $conn->insert_id;
        
        // Insertar cita
        $sql_cita = "INSERT INTO citas (paciente_id, fecha_cita, motivo) 
                     VALUES ('$paciente_id', '$fecha_cita', '$motivo')";
        
        if ($conn->query($sql_cita) === TRUE) {
            // Mostrar mensaje de éxito
            echo "<div class='alert alert-success text-center mt-5'>
                    <h2>¡Cita registrada con éxito!</h2>
                    <p>Hemos agendado tu cita para el día " . date('d/m/Y H:i', strtotime($fecha_cita)) . "</p>
                    <a href='index.html' class='btn btn-primary'>Volver al formulario</a>
                  </div>";
        } else {
            echo "<div class='alert alert-danger'>Error al registrar la cita: " . $conn->error . "</div>";
        }
    } else {
        echo "<div class='alert alert-danger'>Error al registrar el paciente: " . $conn->error . "</div>";
    }
} else {
    echo "<div class='alert alert-warning'>No se recibieron datos del formulario.</div>";
}

$conn->close();
?>