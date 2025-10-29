<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GestionAcademica extends Model
{
    use HasFactory;

    protected $table = 'gestiones_academicas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'anio',
        'periodo',
        'fecha_inicio',
        'fecha_fin',
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
            'anio' => 'integer',
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'activo' => 'boolean',
        ];
    }

    /**
     * Relación: Una gestión académica tiene muchos grupos
     */
    public function grupos()
    {
        return $this->hasMany(Grupo::class, 'gestion_academica_id');
    }
}
