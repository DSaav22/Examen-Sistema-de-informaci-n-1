<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    use HasFactory;

    protected $table = 'asistencias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'grupo_id',
        'docente_id',
        'fecha',
        'hora_registro',
        'estado',
        'observaciones',
        'metodo_registro',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'hora_registro' => 'datetime:H:i',
        ];
    }

    /**
     * Relación: Una asistencia pertenece a un grupo
     */
    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    /**
     * Relación: Una asistencia pertenece a un docente
     */
    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }
}
