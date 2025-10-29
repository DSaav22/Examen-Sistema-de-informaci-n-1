<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Asistencia extends Model implements Auditable
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    protected $table = 'asistencias';

    protected $fillable = [
        'horario_id',
        'docente_id',
        'fecha',
        'hora_registro',
        'token_id',
        'estado',
        'observaciones',
    ];
}
