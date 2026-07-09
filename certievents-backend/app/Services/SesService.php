<?php

# Responsável pelo envio de e-mails através da AWS
namespace App\Services;

use Aws\Ses\SesClient;
use Symfony\Component\Mime\Email;

class SesService
{
    protected $client;

    public function __construct()
    {
        // Inicializa o cliente SES com as configurações da AWS
        $this->client = new SesClient([
            'version' => 'latest',
            'region'  => env('AWS_DEFAULT_REGION'),
        ]);
    }

    # Envia um e-mail com o certificado em anexo para o usuário
    public function enviarCertificado(string $emailDestino, string $nomeUsuario, string $caminhoPdf)
    {
        // Monta o e-mail usando Symfony Mailer
        $email = (new Email())
            ->from(env('SES_FROM_EMAIL'))
            ->to($emailDestino)
            ->subject('Seu certificado - Demo Week')
            ->text("Olá {$nomeUsuario}, segue em anexo seu certificado de participação na Demo Week.")
            // Corpo do e-mail (texto puro)
            ->attachFromPath($caminhoPdf, 'certificado.pdf', 'application/pdf');
        // Envia o e-mail via SES
        $this->client->sendRawEmail([
            // Converte o e-mail para formato raw
            'RawMessage' => ['Data' => $email->toString()],
        ]);
    }
}