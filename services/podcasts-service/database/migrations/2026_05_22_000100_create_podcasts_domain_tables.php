<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('categorias_podcast')) {
            Schema::create('categorias_podcast', function (Blueprint $table) {
                $table->increments('id_categoria_podcast');
                $table->string('nombre', 100)->unique();
                $table->text('descripcion')->nullable();
            });
        }

        if (!Schema::hasTable('podcasts')) {
            Schema::create('podcasts', function (Blueprint $table) {
                $table->increments('id_podcast');
                $table->integer('id_canal');
                $table->integer('id_usuario_propietario')->nullable();
                $table->unsignedInteger('id_categoria_podcast');
                $table->string('nombre', 150);
                $table->text('descripcion')->nullable();
                $table->string('imagen_portada', 255)->nullable();
                $table->dateTime('fecha_creacion')->useCurrent();
                $table->enum('estado', ['activo', 'inactivo'])->default('activo');

                $table->unique(['id_canal', 'nombre'], 'uq_podcast_nombre_canal');
                $table->index('id_usuario_propietario', 'idx_podcast_usuario');
                $table->index('id_canal', 'idx_podcast_canal');

                $table->foreign('id_categoria_podcast', 'fk_podcast_categoria')
                    ->references('id_categoria_podcast')
                    ->on('categorias_podcast')
                    ->onDelete('restrict')
                    ->onUpdate('cascade');
            });
        } elseif (!Schema::hasColumn('podcasts', 'id_usuario_propietario')) {
            Schema::table('podcasts', function (Blueprint $table) {
                $table->integer('id_usuario_propietario')->nullable()->after('id_canal');
                $table->index('id_usuario_propietario', 'idx_podcast_usuario');
            });
        }

        if (!Schema::hasTable('episodios')) {
            Schema::create('episodios', function (Blueprint $table) {
                $table->increments('id_episodio');
                $table->unsignedInteger('id_podcast');
                $table->string('titulo', 150);
                $table->text('descripcion')->nullable();
                $table->dateTime('fecha_publicacion')->useCurrent();
                $table->time('duracion')->nullable();
                $table->enum('estado', ['borrador', 'publicado', 'eliminado'])->default('publicado');
                $table->unsignedInteger('numero_episodio')->nullable();

                $table->index('estado', 'idx_episodio_estado');
                $table->index('fecha_publicacion', 'idx_episodio_fecha');

                $table->foreign('id_podcast', 'fk_episodio_podcast')
                    ->references('id_podcast')
                    ->on('podcasts')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
            });
        } elseif (!Schema::hasColumn('episodios', 'numero_episodio')) {
            Schema::table('episodios', function (Blueprint $table) {
                $table->unsignedInteger('numero_episodio')->nullable()->after('estado');
            });
        }

        if (!Schema::hasTable('archivos_audio')) {
            Schema::create('archivos_audio', function (Blueprint $table) {
                $table->increments('id_archivo_audio');
                $table->unsignedInteger('id_episodio')->unique();
                $table->string('nombre_archivo', 255);
                $table->string('url_archivo', 255);
                $table->string('formato', 20);
                $table->decimal('tamano_mb', 10, 2)->nullable();

                $table->foreign('id_episodio', 'fk_audio_episodio')
                    ->references('id_episodio')
                    ->on('episodios')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
            });
        }

        if (!Schema::hasTable('historial_podcast')) {
            Schema::create('historial_podcast', function (Blueprint $table) {
                $table->increments('id_historial');
                $table->unsignedInteger('id_podcast');
                $table->dateTime('fecha_registro')->useCurrent();
                $table->string('accion', 100);
                $table->text('detalle')->nullable();

                $table->foreign('id_podcast', 'fk_historial_podcast')
                    ->references('id_podcast')
                    ->on('podcasts')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
            });
        }

        if (!Schema::hasTable('reproducciones_podcast')) {
            Schema::create('reproducciones_podcast', function (Blueprint $table) {
                $table->increments('id_reproduccion');
                $table->unsignedInteger('id_podcast');
                $table->unsignedInteger('id_episodio');
                $table->integer('id_usuario')->nullable();
                $table->dateTime('fecha_reproduccion')->useCurrent();
                $table->time('tiempo_escuchado')->nullable();
                $table->boolean('completado')->default(false);
                $table->string('dispositivo', 100)->nullable();

                $table->index('id_podcast', 'idx_reproduccion_podcast');
                $table->index('id_episodio', 'idx_reproduccion_episodio');

                $table->foreign('id_podcast', 'fk_repro_podcast')
                    ->references('id_podcast')
                    ->on('podcasts')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');

                $table->foreign('id_episodio', 'fk_repro_episodio')
                    ->references('id_episodio')
                    ->on('episodios')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
            });
        }

        if (Schema::hasTable('categorias_podcast') && DB::table('categorias_podcast')->count() === 0) {
            DB::table('categorias_podcast')->insert([
                ['nombre' => 'Tecnologia', 'descripcion' => 'Temas de software, hardware y tendencias.'],
                ['nombre' => 'Gaming', 'descripcion' => 'Videojuegos, comunidades y entretenimiento.'],
                ['nombre' => 'Entretenimiento', 'descripcion' => 'Cultura digital, musica y ocio.'],
                ['nombre' => 'Educacion', 'descripcion' => 'Contenido formativo y divulgativo.'],
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('reproducciones_podcast');
        Schema::dropIfExists('historial_podcast');
        Schema::dropIfExists('archivos_audio');
        Schema::dropIfExists('episodios');
        Schema::dropIfExists('podcasts');
        Schema::dropIfExists('categorias_podcast');
    }
};
