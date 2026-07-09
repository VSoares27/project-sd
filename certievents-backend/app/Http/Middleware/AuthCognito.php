<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\CognitoService;
use Aws\Exception\AwsException;

class AuthCognito
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token não fornecido.'], 401);
        }

        try {
            $cognito = new CognitoService();
            $cognito->getUser($token);
        } catch (AwsException $e) {
            return response()->json(['message' => 'Token inválido ou expirado.'], 401);
        }

        return $next($request);
    }
}

/**
 * Middleware de autenticação via AWS Cognito
 * 
 * Responsável por validar tokens de acesso nas requisições protegidas.
 * Funciona como um guarda que verifica se o usuário está autenticado
 * antes de permitir o acesso a determinadas rotas.
 * 
 * Como funciona?
 * 1. Extrai o token do cabeçalho Authorization (Bearer Token)
 * 2. Valida o token com o Cognito
 * 3. Se válido : libera a requisição
 * 4. Se inválido : retorna erro 401 (Não autorizado)
 */