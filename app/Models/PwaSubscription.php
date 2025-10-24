<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PwaSubscription extends Model
{
    use HasFactory;

    protected $table = 'pwa_subscriptions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'usuario_id',
        'endpoint',
        'public_key',
        'auth_token',
        'user_agent',
    ];

    /**
     * Relación: Una suscripción pertenece a un usuario
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
