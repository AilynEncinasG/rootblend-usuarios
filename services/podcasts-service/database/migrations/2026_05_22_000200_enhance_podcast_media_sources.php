<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('podcasts')) {
            if (!Schema::hasColumn('podcasts', 'tipo_portada')) {
                DB::statement("ALTER TABLE podcasts ADD tipo_portada VARCHAR(30) NULL DEFAULT 'url' AFTER imagen_portada");
            }

            DB::statement("ALTER TABLE podcasts MODIFY imagen_portada VARCHAR(2048) NULL");
        }

        if (Schema::hasTable('archivos_audio')) {
            if (!Schema::hasColumn('archivos_audio', 'tipo_origen')) {
                DB::statement("ALTER TABLE archivos_audio ADD tipo_origen VARCHAR(30) NOT NULL DEFAULT 'url' AFTER id_episodio");
            }

            if (!Schema::hasColumn('archivos_audio', 'youtube_id')) {
                DB::statement("ALTER TABLE archivos_audio ADD youtube_id VARCHAR(40) NULL AFTER url_archivo");
            }

            if (!Schema::hasColumn('archivos_audio', 'embed_url')) {
                DB::statement("ALTER TABLE archivos_audio ADD embed_url VARCHAR(2048) NULL AFTER youtube_id");
            }

            DB::statement("ALTER TABLE archivos_audio MODIFY url_archivo VARCHAR(2048) NOT NULL");
            DB::statement("ALTER TABLE archivos_audio MODIFY nombre_archivo VARCHAR(255) NOT NULL");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('archivos_audio')) {
            if (Schema::hasColumn('archivos_audio', 'embed_url')) {
                DB::statement("ALTER TABLE archivos_audio DROP COLUMN embed_url");
            }

            if (Schema::hasColumn('archivos_audio', 'youtube_id')) {
                DB::statement("ALTER TABLE archivos_audio DROP COLUMN youtube_id");
            }

            if (Schema::hasColumn('archivos_audio', 'tipo_origen')) {
                DB::statement("ALTER TABLE archivos_audio DROP COLUMN tipo_origen");
            }
        }

        if (Schema::hasTable('podcasts') && Schema::hasColumn('podcasts', 'tipo_portada')) {
            DB::statement("ALTER TABLE podcasts DROP COLUMN tipo_portada");
        }
    }
};
