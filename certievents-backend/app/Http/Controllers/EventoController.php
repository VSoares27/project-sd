<?php

namespace App\Http\Controllers;

# Controlador de informações do evento
# Responsável por fornecer dados públicos sobre o evento
class EventoController extends Controller
{
    public function infos()
    {
        return response()->json([
            'nome' => 'Demo Week',
            'instituicao' => 'IFPE - Campus Igarassu',
            'descricao' => 'Evento de apresentação de projetos práticos do curso de TSI.',
            'data' => '2026-09-08',
            'horario' => '14:00',
        ]);
    }
}