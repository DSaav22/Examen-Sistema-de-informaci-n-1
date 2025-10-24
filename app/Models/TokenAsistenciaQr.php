<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TokenAsistenciaQr extends Model
{
    use HasFactory;

    protected $table = 'tokens_asistencia_qr';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'grupo_id',
        'docente_id',
        'token',
        'fecha_hora_generacion',
        'fecha_hora_expiracion',
        'usado',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha_hora_generacion' => 'datetime',
            'fecha_hora_expiracion' => 'datetime',
            'usado' => 'boolean',
        ];
    }

    /**
     * Relación: Un token pertenece a un grupo
     */
    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    /**
     * Relación: Un token pertenece a un docente
     */
    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }

    /**
     * Verificar si el token está expirado
     */
    public function isExpired(): bool
    {
        return now()->greaterThan($this->fecha_hora_expiracion);
    }

    /**
     * Verificar si el token es válido (no usado y no expirado)
     */
    public function isValid(): bool
    {
        return !$this->usado && !$this->isExpired();
    }
}
