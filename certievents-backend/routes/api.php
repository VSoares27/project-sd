<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\CertificadoController;

Route::post('/cadastro', [AuthController::class, 'cadastro']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth.cognito')->group(function () {
    Route::get('/evento', [EventoController::class, 'infos']);
    Route::post('/gerar-certificado', [CertificadoController::class, 'gerar']);
});