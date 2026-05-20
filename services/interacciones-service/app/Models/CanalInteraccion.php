<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CanalInteraccion extends Model
{
    protected $table = 'canales_interaccion';
    protected $primaryKey = 'id_canal';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_canal',
        'nombre_canal',
        'tipo_canal',
        'estado_transmision',
    ];
}
