<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\S3Service;
use App\Services\SesService;
use App\Services\DynamoDbService;

# Controlador de certificados
# Gera PDF, armazena no S3, salva no DynamoDB e envia por e-mail
class CertificadoController extends Controller
{
    protected $s3;
    protected $ses;
    protected $dynamo;

    public function __construct(S3Service $s3, SesService $ses, DynamoDbService $dynamo)
    {
        $this->s3 = $s3;
        $this->ses = $ses;
        $this->dynamo = $dynamo;
    }

    # Fluxo completo de geração do certificado
    public function gerar(Request $request)
    {
        $request->validate([
            'userId' => 'required|string',
            'nome' => 'required|string',
            'email' => 'required|email',
        ]);

        $certificadoId = Str::uuid()->toString();
        $nomeEvento = 'Demo Week';
        $dataEvento = now()->format('d/m/Y');

        // Gerar o PDF
        $pdf = Pdf::loadView('certificado', [
            'nome' => $request->nome,
            'evento' => $nomeEvento,
            'data' => $dataEvento,
            'certificadoId' => $certificadoId,
        ]);

        $pastaTemp = storage_path('app/temp');
        if (!file_exists($pastaTemp)) {
            mkdir($pastaTemp, 0755, true);
        }

        $caminhoLocal = $pastaTemp . "/{$certificadoId}.pdf";
        $pdf->save($caminhoLocal);

        // Subir pro S3
        $urlS3 = $this->s3->upload($caminhoLocal, $request->userId, $certificadoId);

        // Salvar registro no DynamoDB
        $this->dynamo->salvarCertificado($certificadoId, $request->userId, $nomeEvento, $urlS3);

        // Enviar por e-mail via SES
        $this->ses->enviarCertificado($request->email, $request->nome, $caminhoLocal);

        // Limpar arquivo temporário local
        unlink($caminhoLocal);

        return response()->json([
            'message' => 'Certificado gerado e enviado por e-mail com sucesso.',
            'certificadoId' => $certificadoId,
            'urlS3' => $urlS3,
        ]);
    }
}