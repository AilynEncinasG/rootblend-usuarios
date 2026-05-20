<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventoNotificable extends Model
{
    protected $table = 'eventos_notificables';
    protected $primaryKey = 'id_evento';
    public $timestamps = false;

    protected $fillable = [
        'id_canal',
        'tipo_evento',
        'descripcion',
        'fecha_evento',
        'estado',
    ];

    protected $casts = [
        'fecha_evento' => 'datetime',
    ];
}
