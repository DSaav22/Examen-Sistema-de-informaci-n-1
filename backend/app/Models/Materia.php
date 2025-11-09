<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Materia extends Model implements Auditable
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    protected $table = 'materias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sigla',
        'nombre',
        'nivel',
        'creditos',
        'horas_semanales',
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
            'nivel' => 'integer',
            'creditos' => 'integer',
            'horas_semanales' => 'integer',
            'activo' => 'boolean',
        ];
    }

    /**
     * Relación: Una materia pertenece a muchas carreras (Muchos a Muchos)
     * Tabla pivote: carrera_materia
     */
    public function carreras()
    {
        return $this->belongsToMany(Carrera::class, 'carrera_materia')
            ->withPivot('semestre_sugerido', 'obligatoria')
            ->withTimestamps();
    }

    /**
     * Relación: Una materia tiene muchos grupos
     */
    public function grupos()
    {
        return $this->hasMany(Grupo::class, 'materia_id');
    }
}
