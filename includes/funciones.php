<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapar / Sanitizar el HTML
function s($html) {
    if($html === null) {
        return '';
    }
    return htmlspecialchars($html, ENT_QUOTES, 'UTF-8');
}


// Validar creación de nueva cuenta
function validarNuevaCuenta($usuario) {
    $alertas = [];

    if(!$usuario->nombre) {
        $alertas['error'][] = 'El nombre es obligatorio';
    }

    if(!$usuario->apellido) {
        $alertas['error'][] = 'El apellido es obligatorio';
    }

    if(!$usuario->email) {
        $alertas['error'][] = 'El email es obligatorio';
    }

    if(!$usuario->password || strlen($usuario->password) < 6) {
        $alertas['error'][] = 'El password debe tener al menos 6 caracteres';
    }

    return $alertas;
}


//Funcion para revisar usuario auth

function isAuth() {
    if(!isset($_SESSION['login'])){
        header('Location: /');
    }
}

function esUltimo(string $actual, string $proximo){
    if($actual !== $proximo){
        return true; 
    }
    return false;
}

function isAdmin() {
    if(!isset($_SESSION['admin'])){
        header('Location: /');
    }
}
