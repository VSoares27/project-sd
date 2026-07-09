<?php
# Responsável pela autenticação de usuários no sistema
namespace App\Services;

use Aws\CognitoIdentityProvider\CognitoIdentityProviderClient;
use Aws\Exception\AwsException;

class CognitoService
{
    protected $client;

    public function __construct()
    {
         // Inicializa o cliente Cognito com as configurações da AWS
        $this->client = new CognitoIdentityProviderClient([
            'version' => 'latest',
            'region'  => env('AWS_DEFAULT_REGION'),
        ]);
    }

    public function cadastrar(string $nome, string $email, string $senha)
    {
        return $this->client->signUp([
            'ClientId' => env('COGNITO_CLIENT_ID'),
            'Username' => $email,
            'Password' => $senha,
            'UserAttributes' => [
                ['Name' => 'email', 'Value' => $email],
                ['Name' => 'name', 'Value' => $nome],
            ],
        ]);
    }

    public function login(string $email, string $senha)
    {
        return $this->client->initiateAuth([
            'AuthFlow' => 'USER_PASSWORD_AUTH',
            'ClientId' => env('COGNITO_CLIENT_ID'),
            'AuthParameters' => [
                'USERNAME' => $email,
                'PASSWORD' => $senha,
            ],
        ]);
    }
# Busca dados do usuário autenticado via AccessToken
    public function getUser(string $accessToken)
    {
        return $this->client->getUser([
            'AccessToken' => $accessToken,
        ]);
    }
}