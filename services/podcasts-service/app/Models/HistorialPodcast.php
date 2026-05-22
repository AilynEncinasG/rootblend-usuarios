<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistorialPodcast extends Model
{
    protected $table = 'historial_podcast';
    protected $primaryKey = 'id_historial';
    public $timestamps = false;

    protected $fillable = [
        'id_podcast',
        'fecha_registro',
        'accion',
        'detalle',
    ];

    protected $casts = [
        'fecha_registro' => 'datetime',
    ];

    public function podcast(): BelongsTo
    {
        return $this->belongsTo(Podcast::class, 'id_podcast', 'id_podcast');
    }
}
