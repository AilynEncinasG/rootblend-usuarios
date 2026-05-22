<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Episodio extends Model
{
    protected $table = 'episodios';
    protected $primaryKey = 'id_episodio';
    public $timestamps = false;

    protected $fillable = [
        'id_podcast',
        'titulo',
        'descripcion',
        'fecha_publicacion',
        'duracion',
        'estado',
        'numero_episodio',
    ];

    protected $casts = [
        'fecha_publicacion' => 'datetime',
    ];

    public function podcast(): BelongsTo
    {
        return $this->belongsTo(Podcast::class, 'id_podcast', 'id_podcast');
    }

    public function archivoAudio(): HasOne
    {
        return $this->hasOne(ArchivoAudio::class, 'id_episodio', 'id_episodio');
    }
}
