<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'DejaVu Serif', serif;
            text-align: center;
            padding: 80px 60px;
            border: 10px solid #1a3d6d;
        }
        h1 {
            font-size: 32px;
            color: #1a3d6d;
            margin-bottom: 10px;
        }
        .subtitulo {
            font-size: 14px;
            color: #666;
            margin-bottom: 40px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .nome {
            font-size: 26px;
            font-weight: bold;
            margin: 30px 0;
            border-bottom: 1px solid #999;
            display: inline-block;
            padding-bottom: 5px;
        }
        .texto {
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            margin: 20px 0;
        }
        .rodape {
            margin-top: 60px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="subtitulo">Certificado de Participação</div>
    <h1>{{ $evento }}</h1>

    <p class="texto">Certificamos que</p>
    <div class="nome">{{ $nome }}</div>
    <p class="texto">
        participou do evento <strong>{{ $evento }}</strong>,<br>
        realizado em {{ $data }} pelo Instituto Federal de Pernambuco - Campus Igarassu.
    </p>

    <div class="rodape">
        Certificado nº {{ $certificadoId }}
    </div>
</body>
</html>