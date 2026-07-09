<?php
# Gerencia o armazenamento de dados no DynamoDB

namespace App\Services;

use Aws\DynamoDb\DynamoDbClient;
use Aws\DynamoDb\Marshaler;

class DynamoDbService
{
    protected $client;
    protected $marshaler;

    public function __construct()
    {
        // Inicializa o cliente DynamoDB com as configurações da AWS
        $this->client = new DynamoDbClient([
            'version' => 'latest',
            'region'  => env('AWS_DEFAULT_REGION'),
        ]);
        // Marshaler converte arrays PHP para formato aceito pelo DynamoDB
        $this->marshaler = new Marshaler();
    }

    # Salva os dados de um usuário no DynamoDB
    public function salvarUsuario(string $userId, string $nome, string $email)
    {
        $this->client->putItem([
            'TableName' => env('DYNAMODB_TABLE_USUARIOS'),
            'Item' => $this->marshaler->marshalItem([
                'userId' => $userId,
                'nome' => $nome,
                'email' => $email,
                'dataCadastro' => now()->toIso8601String(),
            ]),
        ]);
    }
    # Salva os dados de um certificado no DynamoDB
    public function salvarCertificado(string $certificadoId, string $userId, string $nomeEvento, string $urlS3)
    {
        $this->client->putItem([
            'TableName' => env('DYNAMODB_TABLE_CERTIFICADOS'),
            'Item' => $this->marshaler->marshalItem([
                'certificadoId' => $certificadoId,
                'userId' => $userId,
                'nomeEvento' => $nomeEvento,
                'dataEmissao' => now()->toIso8601String(),
                'urlS3' => $urlS3,
                'status' => 'emitido',
            ]),
        ]);
    }
}