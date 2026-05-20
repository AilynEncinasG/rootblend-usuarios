<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seguimiento extends Model
{
    protected $table = 'seguimientos';
    protected $primaryKey = 'id_seguimiento';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_canal',
        'fecha_seguimiento',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'fecha_seguimiento' => 'datetime',
    ];
}
