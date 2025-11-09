<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Listado de Docentes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #4F46E5;
            margin: 0;
            font-size: 24px;
        }
        .header p {
            color: #666;
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #4F46E5;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-active {
            background-color: #10B981;
            color: white;
        }
        .badge-inactive {
            background-color: #EF4444;
            color: white;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Sistema de Horarios</h1>
        <h2>Listado de Docentes</h2>
        <p>Fecha de generación: {{ $fecha }}</p>
        <p>Total de docentes activos: {{ $docentes->count() }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Código</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>CI</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                <th>Grado Académico</th>
            </tr>
        </thead>
        <tbody>
            @foreach($docentes as $docente)
            <tr>
                <td>{{ $docente->codigo_docente }}</td>
                <td>{{ $docente->usuario->name ?? 'N/A' }}</td>
                <td>{{ $docente->usuario->email ?? 'N/A' }}</td>
                <td>{{ $docente->ci ?? 'N/A' }}</td>
                <td>{{ $docente->telefono ?? 'N/A' }}</td>
                <td>{{ $docente->especialidad ?? 'N/A' }}</td>
                <td>{{ $docente->grado_academico ?? 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Documento generado automáticamente por el Sistema de Horarios - Universidad XYZ</p>
    </div>
</body>
</html>
