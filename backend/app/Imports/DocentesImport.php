<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Docente;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;

class DocentesImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError
{
    use SkipsErrors;

    protected $createdCount = 0;
    protected $updatedCount = 0;
    protected $errors = [];

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Verificar si el usuario ya existe por email
        $user = User::where('email', $row['email'])->first();

        if (!$user) {
            // Crear nuevo usuario
            $user = User::create([
                'name' => $row['nombre'],
                'email' => $row['email'],
                'ci' => $row['ci'],
                'telefono' => $row['telefono'] ?? null,
                'password' => Hash::make($row['password'] ?? 'Docente123.'),
                'rol_id' => 3, // Rol docente
                'activo' => true,
                'email_verified_at' => now(),
            ]);

            // Crear registro de docente
            Docente::create([
                'usuario_id' => $user->id,
                'especialidad' => $row['especialidad'] ?? null,
                'grado_academico' => $row['grado_academico'] ?? null,
            ]);

            $this->createdCount++;
        } else {
            // Si el usuario existe, verificar si tiene registro de docente
            $docente = Docente::where('usuario_id', $user->id)->first();

            if (!$docente) {
                // Crear registro de docente para usuario existente
                Docente::create([
                    'usuario_id' => $user->id,
                    'especialidad' => $row['especialidad'] ?? null,
                    'grado_academico' => $row['grado_academico'] ?? null,
                ]);

                $this->createdCount++;
            } else {
                // Actualizar datos del docente existente
                $docente->update([
                    'especialidad' => $row['especialidad'] ?? $docente->especialidad,
                    'grado_academico' => $row['grado_academico'] ?? $docente->grado_academico,
                ]);

                $this->updatedCount++;
            }
        }

        return null;
    }

    /**
     * Reglas de validación para cada fila
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'ci' => 'required|string|max:20',
            'telefono' => 'nullable|string|max:20',
            'especialidad' => 'nullable|string|max:255',
            'grado_academico' => 'nullable|string|max:100',
        ];
    }

    /**
     * Mensajes de validación personalizados
     */
    public function customValidationMessages()
    {
        return [
            'nombre.required' => 'El nombre es obligatorio.',
            'email.required' => 'El email es obligatorio.',
            'email.email' => 'El email debe ser válido.',
            'ci.required' => 'El CI es obligatorio.',
        ];
    }

    /**
     * Obtener contadores
     */
    public function getCreatedCount()
    {
        return $this->createdCount;
    }

    public function getUpdatedCount()
    {
        return $this->updatedCount;
    }
}
