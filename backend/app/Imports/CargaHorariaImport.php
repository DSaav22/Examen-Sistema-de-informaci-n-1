<?php

namespace App\Imports;

use App\Models\Carrera;
use App\Models\Docente;
use App\Models\Facultad;
use App\Models\GestionAcademica;
use App\Models\Grupo;
use App\Models\Materia;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class CargaHorariaImport implements ToCollection, WithHeadingRow
{
    protected $importedCount = 0;
    protected $errors = [];
    protected $skippedCount = 0;

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        // Obtener la gestión académica actual (puedes ajustar esto según tu lógica)
        $gestionActual = GestionAcademica::where('activo', true)->first();
        
        if (!$gestionActual) {
            // Si no hay gestión activa, crear una por defecto
            $nombreGestion = '2024-2025';
            
            // Extraer año y periodo del nombre
            $partesNombre = explode('-', $nombreGestion); // Separa "2024-2025"
            $anio = $partesNombre[0] ?? date('Y'); // '2024' o el año actual
            $periodo = 'I'; // <-- ¡ARREGLADO! Debe ser 'I' o 'II' (es un ENUM)
            
            $gestionActual = GestionAcademica::create([
                'nombre' => $nombreGestion,
                'anio' => (int)$anio,       // <-- Campo requerido
                'periodo' => $periodo,       // <-- Campo requerido (ENUM: 'I' o 'II')
                'fecha_inicio' => now()->startOfYear(),
                'fecha_fin' => now()->endOfYear(),
                'activo' => true,
            ]);
        }

        // Rol de docente
        $rolDocente = Role::where('nombre', 'docente')->first();

        foreach ($rows as $index => $row) {
            try {
                DB::beginTransaction();

                // Validar que la fila tenga datos mínimos requeridos
                $camposFaltantes = [];
                
                if (empty($row['materia_sigla'])) $camposFaltantes[] = 'materia_sigla';
                if (empty($row['materia_nombre'])) $camposFaltantes[] = 'materia_nombre';
                if (empty($row['codigo_docente'])) $camposFaltantes[] = 'codigo_docente';
                if (empty($row['nombre_docente'])) $camposFaltantes[] = 'nombre_docente';
                if (empty($row['carrera_sigla']) && empty($row['carrera_nombre'])) $camposFaltantes[] = 'carrera_sigla o carrera_nombre';
                
                if (!empty($camposFaltantes)) {
                    $this->skippedCount++;
                    Log::warning("Fila {$index} omitida: faltan datos requeridos: " . implode(', ', $camposFaltantes), ['row' => $row->toArray()]);
                    DB::rollBack();
                    continue;
                }

                // 1. BUSCAR O CREAR FACULTAD
                $facultad = $this->getOrCreateFacultad($row);

                // 2. BUSCAR O CREAR CARRERA
                $carrera = $this->getOrCreateCarrera($row, $facultad);

                // 3. BUSCAR O CREAR DOCENTE
                $docente = $this->getOrCreateDocente($row, $rolDocente);

                // 4. BUSCAR O CREAR MATERIA
                $materia = $this->getOrCreateMateria($row);

                // 5. VINCULAR MATERIA CON CARRERA (M:N)
                $this->vincularMateriaCarrera($materia, $carrera, $row);

                // 6. CREAR GRUPO
                $this->crearGrupo($row, $materia, $docente, $gestionActual);

                $this->importedCount++;
                DB::commit();

            } catch (\Exception $e) {
                DB::rollBack();
                $this->errors[] = "Fila {$index}: {$e->getMessage()}";
                Log::error("Error importando fila {$index}", [
                    'error' => $e->getMessage(),
                    'row' => $row->toArray()
                ]);
            }
        }
    }

    /**
     * Obtener o crear Facultad
     */
    protected function getOrCreateFacultad($row)
    {
        $nombreFacultad = trim($row['facultad'] ?? 'Facultad de Tecnología');
        
        return Facultad::firstOrCreate(
            ['nombre' => $nombreFacultad],
            [
                'codigo' => strtoupper(substr($nombreFacultad, 0, 3)),
                'descripcion' => "Facultad importada automáticamente",
                'activo' => true,
            ]
        );
    }

    /**
     * Obtener o crear Carrera
     */
    protected function getOrCreateCarrera($row, Facultad $facultad)
    {
        $nombreCarrera = trim($row['carrera_nombre'] ?? $row['carrera_sigla']);
        
        return Carrera::firstOrCreate(
            ['nombre' => $nombreCarrera],
            [
                'codigo' => strtoupper(trim($row['carrera_sigla'] ?? substr($nombreCarrera, 0, 5))),
                'facultad_id' => $facultad->id,
                'duracion_semestres' => 10, // Valor por defecto
                'descripcion' => "Carrera importada automáticamente",
                'activo' => true,
            ]
        );
    }

    /**
     * Obtener o crear Docente
     */
    protected function getOrCreateDocente($row, $rolDocente)
    {
        $codigoDocente = trim($row['codigo_docente']);
        $nombreDocente = trim($row['nombre_docente']);
        $cargo = trim($row['docente_cargo'] ?? $row['cargo'] ?? 'Docente');

        // Buscar docente existente
        $docente = Docente::where('codigo_docente', $codigoDocente)->first();

        if ($docente) {
            // Actualizar cargo si cambió
            if ($docente->cargo !== $cargo) {
                $docente->update(['cargo' => $cargo]);
            }
            return $docente;
        }

        // Crear nuevo usuario
        $email = $this->generarEmailDocente($nombreDocente, $codigoDocente);
        
        $usuario = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $nombreDocente,
                'password' => Hash::make('password123'), // Password por defecto
                'rol_id' => $rolDocente->id,
                'ci' => $codigoDocente, // Usar código como CI temporal
                'telefono' => '00000000',
                'activo' => true,
                'email_verified_at' => now(),
            ]
        );

        // Crear docente
        return Docente::create([
            'usuario_id' => $usuario->id,
            'codigo_docente' => $codigoDocente,
            'especialidad' => trim($row['docente_especialidad'] ?? $row['especialidad'] ?? 'General'),
            'cargo' => $cargo,
            'grado_academico' => trim($row['docente_grado_academico'] ?? $row['grado_academico'] ?? 'Licenciatura'),
            'fecha_contratacion' => now()->subYears(rand(1, 10)),
            'tipo_contrato' => trim($row['docente_tipo_contrato'] ?? $row['tipo_contrato'] ?? 'Tiempo Completo'),
            'activo' => true,
        ]);
    }

    /**
     * Obtener o crear Materia
     */
    protected function getOrCreateMateria($row)
    {
        $sigla = trim($row['materia_sigla']);
        $nombre = trim($row['materia_nombre']);
        
        return Materia::firstOrCreate(
            ['sigla' => $sigla],
            [
                'nombre' => $nombre,
                'nivel' => (int)($row['nivel'] ?? $row['materia_nivel'] ?? 1),
                'creditos' => (int)($row['creditos'] ?? 4),
                'horas_semanales' => (int)($row['horas_programadas'] ?? 4),
                'descripcion' => "Materia importada desde carga horaria",
                'activo' => true,
            ]
        );
    }

    /**
     * Vincular Materia con Carrera (M:N)
     */
    protected function vincularMateriaCarrera(Materia $materia, Carrera $carrera, $row)
    {
        // Usar syncWithoutDetaching para no eliminar otras relaciones existentes
        if (!$materia->carreras()->where('carrera_id', $carrera->id)->exists()) {
            $materia->carreras()->attach($carrera->id, [
                'semestre_sugerido' => (int)($row['materia_nivel'] ?? $row['nivel'] ?? 1),
                'obligatoria' => true,
            ]);
        }
    }

    /**
     * Crear Grupo
     */
    protected function crearGrupo($row, Materia $materia, Docente $docente, GestionAcademica $gestion)
    {
        $nombreGrupo = trim($row['nombre_grupo'] ?? 'Grupo A');
        $cuposOfrecidos = (int)($row['cupos_ofrecidos'] ?? 40);
        $inscritos = (int)($row['inscritos'] ?? 0);
        $estado = trim($row['estado'] ?? 'Abierto');

        // Verificar si ya existe un grupo similar
        $grupoExistente = Grupo::where('materia_id', $materia->id)
            ->where('docente_id', $docente->id)
            ->where('gestion_academica_id', $gestion->id)
            ->where('nombre_grupo', $nombreGrupo)
            ->first();

        if ($grupoExistente) {
            // Actualizar si es necesario
            $grupoExistente->update([
                'cupos_ofrecidos' => $cuposOfrecidos,
                'inscritos' => $inscritos,
                'estado' => $estado,
            ]);
            return $grupoExistente;
        }

        // Crear nuevo grupo
        return Grupo::create([
            'materia_id' => $materia->id,
            'docente_id' => $docente->id,
            'gestion_academica_id' => $gestion->id,
            'nombre_grupo' => $nombreGrupo,
            'cupos_ofrecidos' => $cuposOfrecidos,
            'inscritos' => $inscritos,
            'estado' => $estado,
        ]);
    }

    /**
     * Generar email único para docente
     */
    protected function generarEmailDocente($nombre, $codigo)
    {
        $nombreSinEspacios = strtolower(str_replace(' ', '.', $nombre));
        $email = $nombreSinEspacios . '@docente.com';
        
        // Si ya existe, agregar código
        if (User::where('email', $email)->exists()) {
            $email = $nombreSinEspacios . '.' . $codigo . '@docente.com';
        }
        
        return $email;
    }

    /**
     * Obtener el resumen de la importación
     */
    public function getImportSummary()
    {
        return [
            'imported' => $this->importedCount,
            'skipped' => $this->skippedCount,
            'errors' => $this->errors,
        ];
    }
}
