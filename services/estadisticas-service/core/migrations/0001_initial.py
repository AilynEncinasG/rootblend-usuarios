from django.db import migrations, models
import django.db.models.deletion


CREATE_TABLES = [
    """
    CREATE TABLE IF NOT EXISTS estadisticas_stream (
        id_estadistica_stream INT AUTO_INCREMENT PRIMARY KEY,
        id_stream INT NOT NULL,
        total_vistas INT NOT NULL DEFAULT 0,
        espectadores_pico INT NOT NULL DEFAULT 0,
        duracion_total TIME NULL,
        fecha_generacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
    """,
    """
    CREATE TABLE IF NOT EXISTS metricas_audiencia (
        id_metrica_audiencia INT AUTO_INCREMENT PRIMARY KEY,
        id_estadistica_stream INT NOT NULL,
        espectadores_actuales INT NOT NULL DEFAULT 0,
        espectadores_unicos INT NOT NULL DEFAULT 0,
        fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        origen_trafico VARCHAR(100) NULL,
        CONSTRAINT fk_audiencia_est_stream
            FOREIGN KEY (id_estadistica_stream) REFERENCES estadisticas_stream(id_estadistica_stream)
            ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB
    """,
    """
    CREATE TABLE IF NOT EXISTS metricas_chat (
        id_metrica_chat INT AUTO_INCREMENT PRIMARY KEY,
        id_estadistica_stream INT NOT NULL,
        total_mensajes INT NOT NULL DEFAULT 0,
        mensajes_eliminados INT NOT NULL DEFAULT 0,
        usuarios_activos INT NOT NULL DEFAULT 0,
        fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_chat_est_stream
            FOREIGN KEY (id_estadistica_stream) REFERENCES estadisticas_stream(id_estadistica_stream)
            ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB
    """,
    """
    CREATE TABLE IF NOT EXISTS estadisticas_podcast (
        id_estadistica_podcast INT AUTO_INCREMENT PRIMARY KEY,
        id_podcast INT NOT NULL,
        total_reproducciones INT NOT NULL DEFAULT 0,
        episodios_publicados INT NOT NULL DEFAULT 0,
        duracion_acumulada TIME NULL,
        fecha_generacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
    """,
    """
    CREATE TABLE IF NOT EXISTS reproducciones_podcast (
        id_reproduccion INT AUTO_INCREMENT PRIMARY KEY,
        id_estadistica_podcast INT NOT NULL,
        id_episodio INT NOT NULL,
        fecha_reproduccion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        tiempo_escuchado TIME NULL,
        completado BOOLEAN NOT NULL DEFAULT FALSE,
        dispositivo VARCHAR(100) NULL,
        CONSTRAINT fk_repro_est_podcast
            FOREIGN KEY (id_estadistica_podcast) REFERENCES estadisticas_podcast(id_estadistica_podcast)
            ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB
    """,
    """
    CREATE TABLE IF NOT EXISTS resumenes_analiticos (
        id_resumen INT AUTO_INCREMENT PRIMARY KEY,
        tipo_resumen VARCHAR(50) NOT NULL,
        periodo VARCHAR(50) NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        descripcion TEXT NULL
    ) ENGINE=InnoDB
    """,
    """
    CREATE TABLE IF NOT EXISTS resumen_estadistica_stream (
        id_resumen INT NOT NULL,
        id_estadistica_stream INT NOT NULL,
        PRIMARY KEY (id_resumen, id_estadistica_stream),
        CONSTRAINT fk_res_stream_resumen
            FOREIGN KEY (id_resumen) REFERENCES resumenes_analiticos(id_resumen)
            ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_res_stream_est
            FOREIGN KEY (id_estadistica_stream) REFERENCES estadisticas_stream(id_estadistica_stream)
            ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB
    """,
    """
    CREATE TABLE IF NOT EXISTS resumen_estadistica_podcast (
        id_resumen INT NOT NULL,
        id_estadistica_podcast INT NOT NULL,
        PRIMARY KEY (id_resumen, id_estadistica_podcast),
        CONSTRAINT fk_res_podcast_resumen
            FOREIGN KEY (id_resumen) REFERENCES resumenes_analiticos(id_resumen)
            ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_res_podcast_est
            FOREIGN KEY (id_estadistica_podcast) REFERENCES estadisticas_podcast(id_estadistica_podcast)
            ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB
    """,
]

DROP_TABLES = [
    "DROP TABLE IF EXISTS resumen_estadistica_podcast",
    "DROP TABLE IF EXISTS resumen_estadistica_stream",
    "DROP TABLE IF EXISTS reproducciones_podcast",
    "DROP TABLE IF EXISTS metricas_chat",
    "DROP TABLE IF EXISTS metricas_audiencia",
    "DROP TABLE IF EXISTS estadisticas_podcast",
    "DROP TABLE IF EXISTS resumenes_analiticos",
    "DROP TABLE IF EXISTS estadisticas_stream",
]


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(sql=CREATE_TABLES, reverse_sql=DROP_TABLES),
            ],
            state_operations=[
                migrations.CreateModel(
                    name="EstadisticaStream",
                    fields=[
                        ("id_estadistica_stream", models.AutoField(primary_key=True, serialize=False)),
                        ("id_stream", models.IntegerField()),
                        ("total_vistas", models.IntegerField(default=0)),
                        ("espectadores_pico", models.IntegerField(default=0)),
                        ("duracion_total", models.TimeField(blank=True, null=True)),
                        ("fecha_generacion", models.DateTimeField(auto_now_add=True)),
                    ],
                    options={"db_table": "estadisticas_stream"},
                ),
                migrations.CreateModel(
                    name="EstadisticaPodcast",
                    fields=[
                        ("id_estadistica_podcast", models.AutoField(primary_key=True, serialize=False)),
                        ("id_podcast", models.IntegerField()),
                        ("total_reproducciones", models.IntegerField(default=0)),
                        ("episodios_publicados", models.IntegerField(default=0)),
                        ("duracion_acumulada", models.TimeField(blank=True, null=True)),
                        ("fecha_generacion", models.DateTimeField(auto_now_add=True)),
                    ],
                    options={"db_table": "estadisticas_podcast"},
                ),
                migrations.CreateModel(
                    name="ResumenAnalitico",
                    fields=[
                        ("id_resumen", models.AutoField(primary_key=True, serialize=False)),
                        ("tipo_resumen", models.CharField(max_length=50)),
                        ("periodo", models.CharField(max_length=50)),
                        ("fecha_inicio", models.DateField()),
                        ("fecha_fin", models.DateField()),
                        ("descripcion", models.TextField(blank=True, null=True)),
                    ],
                    options={"db_table": "resumenes_analiticos"},
                ),
                migrations.CreateModel(
                    name="MetricaAudiencia",
                    fields=[
                        ("id_metrica_audiencia", models.AutoField(primary_key=True, serialize=False)),
                        ("espectadores_actuales", models.IntegerField(default=0)),
                        ("espectadores_unicos", models.IntegerField(default=0)),
                        ("fecha_registro", models.DateTimeField(auto_now_add=True)),
                        ("origen_trafico", models.CharField(blank=True, max_length=100, null=True)),
                        ("estadistica_stream", models.ForeignKey(db_column="id_estadistica_stream", on_delete=django.db.models.deletion.CASCADE, related_name="metricas_audiencia", to="core.estadisticastream")),
                    ],
                    options={"db_table": "metricas_audiencia"},
                ),
                migrations.CreateModel(
                    name="MetricaChat",
                    fields=[
                        ("id_metrica_chat", models.AutoField(primary_key=True, serialize=False)),
                        ("total_mensajes", models.IntegerField(default=0)),
                        ("mensajes_eliminados", models.IntegerField(default=0)),
                        ("usuarios_activos", models.IntegerField(default=0)),
                        ("fecha_registro", models.DateTimeField(auto_now_add=True)),
                        ("estadistica_stream", models.ForeignKey(db_column="id_estadistica_stream", on_delete=django.db.models.deletion.CASCADE, related_name="metricas_chat", to="core.estadisticastream")),
                    ],
                    options={"db_table": "metricas_chat"},
                ),
                migrations.CreateModel(
                    name="ReproduccionPodcast",
                    fields=[
                        ("id_reproduccion", models.AutoField(primary_key=True, serialize=False)),
                        ("id_episodio", models.IntegerField()),
                        ("fecha_reproduccion", models.DateTimeField(auto_now_add=True)),
                        ("tiempo_escuchado", models.TimeField(blank=True, null=True)),
                        ("completado", models.BooleanField(default=False)),
                        ("dispositivo", models.CharField(blank=True, max_length=100, null=True)),
                        ("estadistica_podcast", models.ForeignKey(db_column="id_estadistica_podcast", on_delete=django.db.models.deletion.CASCADE, related_name="reproducciones", to="core.estadisticapodcast")),
                    ],
                    options={"db_table": "reproducciones_podcast"},
                ),
            ],
        ),
    ]
