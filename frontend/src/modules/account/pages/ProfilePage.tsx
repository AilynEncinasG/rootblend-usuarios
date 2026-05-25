import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCalendar,
  FiEdit3,
  FiMail,
  FiRefreshCw,
  FiSettings,
  FiShield,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import { getStoredUser } from "../../auth/utils/authStorage";
import { getMe, type MeResponse } from "../../../services/userService";
import {
  AlertPanel,
  Avatar,
  ButtonRow,
  ChannelHero,
  GhostLink,
  InfoGrid,
  MetricGrid,
  Panel,
  PanelHeader,
  PrimaryLink,
  ProfileBioBox,
  ProfileHeroInfo,
  TwoCol,
} from "../../../shared/styles/legacyStyled";
import { StatCard } from "../../public/utils/publicLegacyHelpers";

function formatShortDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }

  return date.toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getInitials(name: string) {
  const cleanName = name.trim();

  if (!cleanName) {
    return "U";
  }

  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function isImageUrl(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/")
  );
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = getStoredUser() as {
    correo?: string;
    nombre_visible?: string;
    estado?: string;
    foto_perfil?: string | null;
  } | null;

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const result = await getMe();

        if (!active) return;

        if (!result.success || !result.data) {
          setError(result.message || "No se pudo cargar el perfil.");
          return;
        }

        setProfileData(result.data);
      } catch (error) {
        console.error("PROFILE_LOAD_ERROR", error);

        if (active) {
          setError("No se pudo conectar con el servicio de usuarios.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const displayName =
    profileData?.perfil.nombre_visible ||
    storedUser?.nombre_visible ||
    storedUser?.correo ||
    "Usuario ROOTBLEND";

  const email =
    profileData?.usuario.correo ||
    storedUser?.correo ||
    "correo@rootblend.dev";

  const estado =
    profileData?.usuario.estado ||
    storedUser?.estado ||
    "activo";

  const fotoPerfil =
    profileData?.perfil.foto_perfil ||
    storedUser?.foto_perfil ||
    null;

  const bio =
    profileData?.perfil.biografia ||
    "Aún no tienes una biografía configurada. Edita tu perfil para personalizar tu presentación pública.";

  const fechaRegistro = profileData?.usuario.fecha_registro || null;
  const ultimoAcceso = profileData?.usuario.ultimo_acceso || null;
  const fechaNacimiento = profileData?.perfil.fecha_nacimiento || null;

  return (
    <RootShell active="home">
      {loading && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando perfil</strong>
            <p>Consultando tus datos reales desde usuarios-service.</p>
          </div>
        </AlertPanel>
      )}

      {error && (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Error al cargar perfil</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      )}

      <ChannelHero $image={brandAssets.channelView}>
        <Avatar $large>
          {isImageUrl(fotoPerfil) ? (
            <img
              src={fotoPerfil || ""}
              alt={displayName}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            getInitials(displayName)
          )}
        </Avatar>

        <ProfileHeroInfo>
          <h1>{displayName}</h1>
          <p>{bio}</p>

          <ButtonRow>
            <PrimaryLink to="/profile/edit">
              <FiEdit3 /> Editar perfil
            </PrimaryLink>

            <GhostLink to="/settings">
              <FiSettings /> Preferencias
            </GhostLink>
          </ButtonRow>
        </ProfileHeroInfo>
      </ChannelHero>

      <MetricGrid>
        <StatCard label="Estado" value={estado} trend="Cuenta" />
        <StatCard label="Correo" value={email} trend="Usuario real" />
        <StatCard
          label="Registro"
          value={formatShortDate(fechaRegistro)}
          trend="Fecha"
        />
        <StatCard
          label="Último acceso"
          value={formatShortDate(ultimoAcceso)}
          trend="Sesión"
        />
      </MetricGrid>

      <InfoGrid>

        <Panel>
          <PanelHeader>
            <strong>
              <FiShield /> Perfil público
            </strong>
            <Link to="/profile/edit">Editar</Link>
          </PanelHeader>

          <TwoCol>
            <span>Nombre visible</span>
            <strong>{displayName}</strong>

            <span>Foto de perfil</span>
            <strong>{fotoPerfil || "Sin foto configurada"}</strong>

            <span>Fecha de nacimiento</span>
            <strong>
              {fechaNacimiento ? formatShortDate(fechaNacimiento) : "No configurada"}
            </strong>
          </TwoCol>

          <ProfileBioBox>
            <span>Biografía</span>
            <p>{bio || "Sin biografía configurada."}</p>
          </ProfileBioBox>
        </Panel>

        <Panel>
          <PanelHeader>
            <strong>
              <FiMail /> Seguridad de acceso
            </strong>
          </PanelHeader>

          <TwoCol>
            <span>Correo principal</span>
            <strong>{email}</strong>

            <span>Contraseña</span>
            <strong>Protegida</strong>

            <span>Cambiar contraseña</span>
            <GhostLink to="/change-password">Ir a seguridad</GhostLink>

            <span>Recuperación</span>
            <GhostLink to="/forgot-password">Enviar enlace</GhostLink>
          </TwoCol>
        </Panel>

        <Panel>
          <PanelHeader>
            <strong>
              <FiCalendar /> Estado del perfil
            </strong>
          </PanelHeader>

          <TwoCol>
            <span>Biografía</span>
            <strong>{profileData?.perfil.biografia ? "Configurada" : "Pendiente"}</strong>

            <span>Foto</span>
            <strong>{fotoPerfil ? "Configurada" : "Pendiente"}</strong>

            <span>Fecha nacimiento</span>
            <strong>{fechaNacimiento ? "Configurada" : "Pendiente"}</strong>
          </TwoCol>
        </Panel>
      </InfoGrid>
    </RootShell>
  );
}