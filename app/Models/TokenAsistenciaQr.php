<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TokenAsistenciaQr extends Model
{
    use HasFactory;

    protected $table = 'tokens_asistencia_qr';

    protected $fillable = [
        'horario_id',
        'token',
        'fecha_generacion',
        'fecha_expiracion',
        'usado',
    ];
}
