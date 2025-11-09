<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carrera extends Model
{
    use HasFactory;

    protected $table = 'carreras';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'codigo',
        'facultad_id',
        'duracion_semestres',
        'descripcion',
        'activo',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'duracion_semestres' => 'integer',
            'activo' => 'boolean',
        ];
    }

    /**
     * Relación: Una carrera pertenece a una facultad
     */
    public function facultad()
    {
        return $this->belongsTo(Facultad::class, 'facultad_id');
    }

    /**
     * Relación: Una carrera tiene muchas materias (Muchos a Muchos)
     * Tabla pivote: carrera_materia
     */
    public function materias()
    {
        return $this->belongsToMany(Materia::class, 'carrera_materia')
            ->withPivot('semestre_sugerido', 'obligatoria')
            ->withTimestamps();
    }
}
