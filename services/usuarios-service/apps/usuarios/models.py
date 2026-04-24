from django.db import models

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    correo = models.EmailField(max_length=150, unique=True)
    estado = models.CharField(
        max_length=20,
        choices=[('activo','activo'),('inactivo','inactivo'),('bloqueado','bloqueado')],
        default='activo'
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultimo_acceso = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.correo


class PerfilUsuario(models.Model):
    id_perfil = models.AutoField(primary_key=True)
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    nombre_visible = models.CharField(max_length=100)
    foto_perfil = models.CharField(max_length=255, null=True, blank=True)
    biografia = models.TextField(null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)