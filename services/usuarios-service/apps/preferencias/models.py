from django.db import models
from apps.usuarios.models import Usuario

class PreferenciaUsuario(models.Model):
    id_preferencia = models.AutoField(primary_key=True)
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    idioma = models.CharField(max_length=20, default='es')
    tema = models.CharField(max_length=20, default='claro')
    autoplay = models.BooleanField(default=True)
    recibir_notificaciones = models.BooleanField(default=True)