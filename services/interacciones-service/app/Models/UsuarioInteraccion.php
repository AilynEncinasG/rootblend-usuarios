<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuarioInteraccion extends Model
{
    protected $table = 'usuarios_interaccion';
    protected $primaryKey = 'id_usuario';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'nombre_usuario',
        'correo',
        'estado',
    ];
}
