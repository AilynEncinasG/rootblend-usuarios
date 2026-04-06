from django.db import models
from apps.usuarios.models import Usuario
from django.utils import timezone
import uuid

class Credencial(models.Model):
    id_credencial = models.AutoField(primary_key=True)
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    password_hash = models.CharField(max_length=255)
    password_salt = models.CharField(max_length=255)
    intentos_fallidos = models.IntegerField(default=0)
    fecha_actualizacion = models.DateTimeField(default=timezone.now)

class Sesion(models.Model):
    id_sesion = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    token_sesion = models.CharField(max_length=255, unique=True, default=uuid.uuid4)
    ip = models.CharField(max_length=45, null=True, blank=True)
    inicio = models.DateTimeField(default=timezone.now)
    fin = models.DateTimeField(null=True, blank=True)
    activa = models.BooleanField(default=True)