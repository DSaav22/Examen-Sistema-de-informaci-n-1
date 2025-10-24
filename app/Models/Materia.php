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
        'nombre',
        'codigo',
        'carrera_id',
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
     * Relación: Una materia pertenece a una carrera
     */
    public function carrera()
    {
        return $this->belongsTo(Carrera::class, 'carrera_id');
    }

    /**
     * Relación: Una materia tiene muchos grupos
     */
    public function grupos()
    {
        return $this->hasMany(Grupo::class, 'materia_id');
    }
}
