<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Podcast extends Model
{
    protected $table = 'podcasts';
    protected $primaryKey = 'id_podcast';
    public $timestamps = false;

    protected $fillable = [
        'id_canal',
        'id_usuario_propietario',
        'id_categoria_podcast',
        'nombre',
        'descripcion',
        'imagen_portada',
        'tipo_portada',
        'fecha_creacion',
        'estado',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaPodcast::class, 'id_categoria_podcast', 'id_categoria_podcast');
    }

    public function episodios(): HasMany
    {
        return $this->hasMany(Episodio::class, 'id_podcast', 'id_podcast');
    }

    public function historial(): HasMany
    {
        return $this->hasMany(HistorialPodcast::class, 'id_podcast', 'id_podcast');
    }
}
