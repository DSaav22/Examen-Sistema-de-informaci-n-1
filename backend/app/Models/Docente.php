<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Docente extends Model implements Auditable
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    protected $table = 'docentes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'usuario_id',
        'codigo_docente',
        'especialidad',
        'cargo',
        'grado_academico',
        'fecha_contratacion',
        'tipo_contrato',
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
            'fecha_contratacion' => 'date',
            'activo' => 'boolean',
        ];
    }

    /**
     * Relación: Un docente pertenece a un usuario
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Relación: Un docente tiene muchos grupos
     */
    public function grupos()
    {
        return $this->hasMany(Grupo::class, 'docente_id');
    }

    /**
     * Relación: Un docente tiene muchas asistencias registradas
     */
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'docente_id');
    }

    /**
     * Relación: Un docente puede generar muchos tokens QR
     */
    public function tokensAsistenciaQr()
    {
        return $this->hasMany(TokenAsistenciaQr::class, 'docente_id');
    }
}
