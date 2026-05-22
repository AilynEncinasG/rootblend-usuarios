<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArchivoAudio extends Model
{
    protected $table = 'archivos_audio';
    protected $primaryKey = 'id_archivo_audio';
    public $timestamps = false;

    protected $fillable = [
        'id_episodio',
        'nombre_archivo',
        'url_archivo',
        'formato',
        'tamano_mb',
    ];

    protected $casts = [
        'tamano_mb' => 'decimal:2',
    ];

    public function episodio(): BelongsTo
    {
        return $this->belongsTo(Episodio::class, 'id_episodio', 'id_episodio');
    }
}
