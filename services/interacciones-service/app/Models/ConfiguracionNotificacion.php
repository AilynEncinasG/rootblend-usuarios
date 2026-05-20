<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfiguracionNotificacion extends Model
{
    protected $table = 'configuraciones_notificacion';
    protected $primaryKey = 'id_configuracion';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'notificar_directos',
        'notificar_suscripciones',
        'notificar_promociones',
        'canal_web',
    ];

    protected $casts = [
        'notificar_directos' => 'boolean',
        'notificar_suscripciones' => 'boolean',
        'notificar_promociones' => 'boolean',
        'canal_web' => 'boolean',
    ];
}
