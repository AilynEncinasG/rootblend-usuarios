<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suscripcion extends Model
{
    protected $table = 'suscripciones';
    protected $primaryKey = 'id_suscripcion';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_canal',
        'fecha_suscripcion',
        'tipo_plan',
        'activa',
        'fecha_vencimiento',
    ];

    protected $casts = [
        'activa' => 'boolean',
        'fecha_suscripcion' => 'datetime',
        'fecha_vencimiento' => 'datetime',
    ];
}
