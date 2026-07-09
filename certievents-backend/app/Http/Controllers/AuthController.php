<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CognitoService;
use App\Services\DynamoDbService;
use Aws\Exception\AwsException;

# Gerencia o cadastro e login de usuários no sistema
# Integra com AWS Cognito (autenticação) e DynamoDB (armazenamento)

class AuthController extends Controller
{
    protected $cognito;
    protected $dynamo;

    #  Injeta as dependências dos serviços AWS
    public function __construct(CognitoService $cognito, DynamoDbService $dynamo)
    {
        $this->cognito = $cognito;
        $this->dynamo = $dynamo;
    }
    # Cadastra um novo usuário no sistema
    public function cadastro(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email',
            'senha' => 'required|min:8',
        ]);

        try {
            $result = $this->cognito->cadastrar(
                $request->nome,
                $request->email,
                $request->senha
            );

            $userId = $result['UserSub'];

            $this->dynamo->salvarUsuario($userId, $request->nome, $request->email);

            return response()->json([
                'message' => 'Cadastro realizado. Verifique seu e-mail para confirmar a conta.',
                'userId' => $userId,
            ], 201);

        } catch (AwsException $e) {
            return response()->json([
                'message' => 'Erro ao cadastrar usuário.',
                'error' => $e->getAwsErrorMessage(),
            ], 400);
        }
    }

    # Realiza login do usuário
     
     # Valida email e senha
     # Autentica no Cognito
     # Retorna tokens de acesso (AccessToken, IdToken, RefreshToken)
     
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'senha' => 'required',
        ]);

        try {
            $result = $this->cognito->login($request->email, $request->senha);

            return response()->json([
                'accessToken' => $result['AuthenticationResult']['AccessToken'],
                'idToken' => $result['AuthenticationResult']['IdToken'],
                'refreshToken' => $result['AuthenticationResult']['RefreshToken'],
            ]);

        } catch (AwsException $e) {
            return response()->json([
                'message' => 'E-mail ou senha inválidos.',
                'error' => $e->getAwsErrorMessage(),
            ], 401);
        }
    }
}