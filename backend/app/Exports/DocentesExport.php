<?php

namespace App\Exports;

use App\Models\Docente;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DocentesExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    /**
     * Retorna la colección de docentes con sus relaciones
     */
    public function collection()
    {
        return Docente::with('usuario.role')
            ->where('activo', true)
            ->orderBy('codigo_docente')
            ->get();
    }

    /**
     * Define los encabezados de las columnas
     */
    public function headings(): array
    {
        return [
            'Código',
            'Nombre Completo',
            'Email',
            'CI',
            'Teléfono',
            'Especialidad',
            'Grado Académico',
            'Estado'
        ];
    }

    /**
     * Mapea cada docente a una fila
     */
    public function map($docente): array
    {
        return [
            $docente->codigo_docente,
            $docente->usuario->name ?? 'N/A',
            $docente->usuario->email ?? 'N/A',
            $docente->ci ?? 'N/A',
            $docente->telefono ?? 'N/A',
            $docente->especialidad ?? 'N/A',
            $docente->grado_academico ?? 'N/A',
            $docente->activo ? 'Activo' : 'Inactivo'
        ];
    }

    /**
     * Aplica estilos a la hoja de Excel
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo para la fila de encabezados
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5']
                ],
                'font' => ['color' => ['rgb' => 'FFFFFF'], 'bold' => true],
            ],
        ];
    }
}
