<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReproduccionPodcast extends Model
{
    protected $table = 'reproducciones_podcast';
    protected $primaryKey = 'id_reproduccion';
    public $timestamps = false;

    protected $fillable = [
        'id_podcast',
        'id_episodio',
        'id_usuario',
        'fecha_reproduccion',
        'tiempo_escuchado',
        'completado',
        'dispositivo',
    ];

    protected $casts = [
        'fecha_reproduccion' => 'datetime',
        'completado' => 'boolean',
    ];

    public function podcast(): BelongsTo
    {
        return $this->belongsTo(Podcast::class, 'id_podcast', 'id_podcast');
    }

    public function episodio(): BelongsTo
    {
        return $this->belongsTo(Episodio::class, 'id_episodio', 'id_episodio');
    }
}
