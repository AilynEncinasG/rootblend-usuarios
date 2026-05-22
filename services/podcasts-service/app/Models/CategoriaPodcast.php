<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoriaPodcast extends Model
{
    protected $table = 'categorias_podcast';
    protected $primaryKey = 'id_categoria_podcast';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
    ];
}
