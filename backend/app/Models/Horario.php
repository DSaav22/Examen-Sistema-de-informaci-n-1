<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Horario extends Model implements Auditable
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    protected $table = 'horarios';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'grupo_id',
        'aula_id',
        'dia_semana',
        'hora_inicio',
        'hora_fin',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'hora_inicio' => 'datetime:H:i',
            'hora_fin' => 'datetime:H:i',
        ];
    }

    /**
     * Relación: Un horario pertenece a un grupo
     */
    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    /**
     * Relación: Un horario pertenece a un aula
     */
    public function aula()
    {
        return $this->belongsTo(Aula::class, 'aula_id');
    }

    /**
     * Accessor: Obtener la materia a través del grupo
     */
    public function getMateriaAttribute()
    {
        return $this->grupo?->materia;
    }

    /**
     * Accessor: Obtener el docente a través del grupo
     */
    public function getDocenteAttribute()
    {
        return $this->grupo?->docente;
    }
}
