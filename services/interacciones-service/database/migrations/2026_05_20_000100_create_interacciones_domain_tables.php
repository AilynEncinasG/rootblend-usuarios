<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios_interaccion', function (Blueprint $table) {
            $table->integer('id_usuario')->primary();
            $table->string('nombre_usuario', 100);
            $table->string('correo', 150)->unique();
            $table->enum('estado', ['activo', 'inactivo', 'bloqueado'])->default('activo');
        });

        Schema::create('canales_interaccion', function (Blueprint $table) {
            $table->integer('id_canal')->primary();
            $table->string('nombre_canal', 100)->unique();
            $table->string('tipo_canal', 50);
            $table->enum('estado_transmision', ['offline', 'online'])->default('offline');
        });

        Schema::create('seguimientos', function (Blueprint $table) {
            $table->increments('id_seguimiento');
            $table->integer('id_usuario');
            $table->integer('id_canal');
            $table->dateTime('fecha_seguimiento')->useCurrent();
            $table->boolean('activo')->default(true);

            $table->unique(['id_usuario', 'id_canal'], 'uq_usuario_canal_seguimiento');

            $table->foreign('id_usuario', 'fk_seg_usuario')
                ->references('id_usuario')
                ->on('usuarios_interaccion')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('id_canal', 'fk_seg_canal')
                ->references('id_canal')
                ->on('canales_interaccion')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        Schema::create('suscripciones', function (Blueprint $table) {
            $table->increments('id_suscripcion');
            $table->integer('id_usuario');
            $table->integer('id_canal');
            $table->dateTime('fecha_suscripcion')->useCurrent();
            $table->string('tipo_plan', 50)->default('mensual');
            $table->boolean('activa')->default(true);
            $table->dateTime('fecha_vencimiento')->nullable();

            $table->unique(['id_usuario', 'id_canal'], 'uq_usuario_canal_suscripcion');

            $table->foreign('id_usuario', 'fk_sus_usuario')
                ->references('id_usuario')
                ->on('usuarios_interaccion')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('id_canal', 'fk_sus_canal')
                ->references('id_canal')
                ->on('canales_interaccion')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        Schema::create('configuraciones_notificacion', function (Blueprint $table) {
            $table->increments('id_configuracion');
            $table->integer('id_usuario')->unique();
            $table->boolean('notificar_directos')->default(true);
            $table->boolean('notificar_suscripciones')->default(true);
            $table->boolean('notificar_promociones')->default(false);
            $table->boolean('canal_web')->default(true);

            $table->foreign('id_usuario', 'fk_conf_usuario')
                ->references('id_usuario')
                ->on('usuarios_interaccion')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        Schema::create('eventos_notificables', function (Blueprint $table) {
            $table->increments('id_evento');
            $table->integer('id_canal');
            $table->string('tipo_evento', 50);
            $table->text('descripcion')->nullable();
            $table->dateTime('fecha_evento')->useCurrent();
            $table->string('estado', 30)->default('pendiente');

            $table->foreign('id_canal', 'fk_evento_canal')
                ->references('id_canal')
                ->on('canales_interaccion')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        Schema::create('notificaciones', function (Blueprint $table) {
            $table->increments('id_notificacion');
            $table->integer('id_usuario');

            // IMPORTANTE:
            // eventos_notificables.id_evento usa increments(),
            // entonces aqui debe ser unsignedInteger().
            $table->unsignedInteger('id_evento');

            $table->string('titulo', 150);
            $table->text('mensaje');
            $table->string('tipo', 50);
            $table->dateTime('fecha_envio')->useCurrent();
            $table->boolean('leida')->default(false);

            $table->foreign('id_usuario', 'fk_notif_usuario')
                ->references('id_usuario')
                ->on('usuarios_interaccion')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('id_evento', 'fk_notif_evento')
                ->references('id_evento')
                ->on('eventos_notificables')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
        Schema::dropIfExists('eventos_notificables');
        Schema::dropIfExists('configuraciones_notificacion');
        Schema::dropIfExists('suscripciones');
        Schema::dropIfExists('seguimientos');
        Schema::dropIfExists('canales_interaccion');
        Schema::dropIfExists('usuarios_interaccion');
    }
};