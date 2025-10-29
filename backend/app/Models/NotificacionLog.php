<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificacionLog extends Model
{
    use HasFactory;

    protected $table = 'notificaciones_log';

    protected $fillable = [
        'user_id',
        'tipo',
        'titulo',
        'mensaje',
        'enviado_en',
        'leido',
        'leido_en',
    ];
}
