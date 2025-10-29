<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Grupo extends Model implements Auditable
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    protected $table = 'grupos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'materia_id',
        'docente_id',
        'gestion_academica_id',
        'nombre_grupo',
        'cupo_maximo',
        'cupo_actual',
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
            'cupo_maximo' => 'integer',
            'cupo_actual' => 'integer',
            'activo' => 'boolean',
        ];
    }

    /**
     * Relación: Un grupo pertenece a una materia
     */
    public function materia()
    {
        return $this->belongsTo(Materia::class, 'materia_id');
    }

    /**
     * Relación: Un grupo pertenece a un docente
     */
    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }

    /**
     * Relación: Un grupo pertenece a una gestión académica
     */
    public function gestionAcademica()
    {
        return $this->belongsTo(GestionAcademica::class, 'gestion_academica_id');
    }

    /**
     * Relación: Un grupo tiene muchos horarios
     */
    public function horarios()
    {
        return $this->hasMany(Horario::class, 'grupo_id');
    }

    /**
     * Relación: Un grupo tiene muchas asistencias
     */
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'grupo_id');
    }

    /**
     * Relación: Un grupo puede tener muchos tokens QR
     */
    public function tokensAsistenciaQr()
    {
        return $this->hasMany(TokenAsistenciaQr::class, 'grupo_id');
    }
}
