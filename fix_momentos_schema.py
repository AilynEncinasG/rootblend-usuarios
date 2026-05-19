from django.db import connection

TABLE_NAME = "momentos_destacados"

columns_to_add = {
    "id_stream": """
        ALTER TABLE momentos_destacados
        ADD COLUMN id_stream INT NULL
    """,
    "thumbnail_url": """
        ALTER TABLE momentos_destacados
        ADD COLUMN thumbnail_url VARCHAR(500) NULL
    """,
    "destacado": """
        ALTER TABLE momentos_destacados
        ADD COLUMN destacado TINYINT(1) NOT NULL DEFAULT 1
    """,
    "vistas_count": """
        ALTER TABLE momentos_destacados
        ADD COLUMN vistas_count INT UNSIGNED NOT NULL DEFAULT 0
    """,
}

with connection.cursor() as cursor:
    cursor.execute(
        """
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = %s
        """,
        [TABLE_NAME],
    )

    existing_columns = {row[0] for row in cursor.fetchall()}

    for column_name, sql in columns_to_add.items():
        if column_name not in existing_columns:
            cursor.execute(sql)
            print(f"[OK] Columna agregada: {column_name}")
        else:
            print(f"[SKIP] Ya existe: {column_name}")

    cursor.execute(
        """
        ALTER TABLE momentos_destacados
        MODIFY COLUMN url_video VARCHAR(500) NOT NULL
        """
    )
    print("[OK] url_video ajustado a VARCHAR(500)")

print("[OK] Tabla momentos_destacados corregida en la base actual.")