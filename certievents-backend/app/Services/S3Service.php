<?php
# Responsável pelo upload e gerenciamento de arquivos no S3
namespace App\Services;

use Aws\S3\S3Client;

class S3Service
{
    protected $client;

    public function __construct()
    {
        // Inicializa o cliente S3 com as configurações da AWS
        $this->client = new S3Client([
            'version' => 'latest',
            'region'  => env('AWS_DEFAULT_REGION'),
        ]);
    }

    #  Faz upload de um arquivo PDF para o S3 e retorna uma URL temporária
    public function upload(string $caminhoLocal, string $userId, string $certificadoId): string
    {
        $key = "certificados/{$userId}/{$certificadoId}.pdf";
         // Faz o upload do arquivo PDF para o S3
        $this->client->putObject([
            'Bucket' => env('S3_BUCKET'),
            'Key'    => $key,
            'Body'   => fopen($caminhoLocal, 'r'),
            'ContentType' => 'application/pdf',
        ]);
        // Cria um comando para gerar uma URL assinada - temporária
        $cmd = $this->client->getCommand('GetObject', [
            'Bucket' => env('S3_BUCKET'),
            'Key'    => $key,
        ]);

        // Gera uma URL pré-assinada válida por 60 minutos
        // Permite que o frontend baixe o PDF sem expor o bucket publicamente
        $request = $this->client->createPresignedRequest($cmd, '+60 minutes');
        // Retorna a URL temporária para download
        return (string) $request->getUri();
    }
}