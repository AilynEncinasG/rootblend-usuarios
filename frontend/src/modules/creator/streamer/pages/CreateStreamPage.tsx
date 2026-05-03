import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RootShell } from "../../../mock/RootblendScreens";
import { FiActivity, FiAlertTriangle, FiCheckCircle, FiRadio, FiRefreshCw, FiSave } from "react-icons/fi";
import {
  createStream,
  getCategories,
  type Categoria,
} from "../../../streams/services/streamsService";

export default function CreateStreamPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("Directo real de ROOTBLEND");
  const [description, setDescription] = useState("Probando flujo real de ROOTBLEND.");
  const [categoryId, setCategoryId] = useState(0);
  const [quality, setQuality] = useState("720p");
  const [bitrate, setBitrate] = useState(2500);
  const [featured, setFeatured] = useState(true);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setLoading(true);
      setError("");

      try {
        const result = await getCategories();

        if (!active) return;

        setCategories(result);
        if (result[0]) setCategoryId(result[0].id_categoria);
      } catch (error) {
        console.error("CREATE_STREAM_CATEGORIES_ERROR", error);
        if (active) setError(error instanceof Error ? error.message : "No se pudieron cargar las categorias.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Debes escribir un titulo para el stream.");
      return;
    }

    if (!categoryId) {
      setError("Debes seleccionar una categoria.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const stream = await createStream({
        titulo: title.trim(),
        descripcion: description.trim(),
        id_categoria: categoryId,
        destacado: featured,
        calidad_actual: quality,
        resolucion: quality,
        bitrate,
        latencia_modo: "normal",
        audio_activo: true,
      });

      setSuccessMessage(`Stream creado correctamente: ${stream.titulo}`);

      window.setTimeout(() => {
        navigate("/creator/streamer/control", { replace: true });
      }, 700);
    } catch (error) {
      console.error("CREATE_STREAM_ERROR", error);
      setError(error instanceof Error ? error.message : "No se pudo crear el stream.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RootShell active="creator">
      <Page>
      <Card onSubmit={submit}>
        <Header>
          <span>Streamer</span>
          <h1>Crear / configurar stream</h1>
          <p>
            Este formulario crea un stream real en estado programado. Luego lo puedes iniciar desde Control de transmision.
          </p>
        </Header>

        {loading && (
          <Alert>
            <FiRefreshCw />
            <div>
              <strong>Cargando categorias</strong>
              <p>Consultando canales-streaming-service.</p>
            </div>
          </Alert>
        )}

        {error && (
          <Alert $danger>
            <FiAlertTriangle />
            <div>
              <strong>Error</strong>
              <p>{error}</p>
            </div>
          </Alert>
        )}

        {successMessage && (
          <Success>
            <FiCheckCircle /> {successMessage}
          </Success>
        )}

        <Label>Titulo del stream</Label>
        <Field>
          <FiRadio />
          <input value={title} disabled={saving} onChange={(event) => setTitle(event.target.value)} />
        </Field>

        <Label>Categoria</Label>
        <Select
          value={categoryId}
          disabled={loading || saving || categories.length === 0}
          onChange={(event) => setCategoryId(Number(event.target.value))}
        >
          {categories.length === 0 ? (
            <option value={0}>Sin categorias disponibles</option>
          ) : (
            categories.map((category) => (
              <option key={category.id_categoria} value={category.id_categoria}>
                {category.nombre}
              </option>
            ))
          )}
        </Select>

        <Label>Descripcion</Label>
        <TextArea value={description} disabled={saving} onChange={(event) => setDescription(event.target.value)} />

        <Label>Calidad</Label>
        <Select value={quality} disabled={saving} onChange={(event) => setQuality(event.target.value)}>
          <option value="1080p">1080p recomendado</option>
          <option value="720p">720p</option>
          <option value="480p">480p</option>
        </Select>

        <Label>Bitrate</Label>
        <Field>
          <FiActivity />
          <input
            type="number"
            min={800}
            value={bitrate}
            disabled={saving}
            onChange={(event) => setBitrate(Number(event.target.value))}
          />
        </Field>

        <ToggleLine>
          <span>Marcar como destacado</span>
          <input type="checkbox" checked={featured} disabled={saving} onChange={(event) => setFeatured(event.target.checked)} />
        </ToggleLine>

        <Actions>
          <GhostLink to="/creator/streamer">Cancelar</GhostLink>
          <PrimaryButton type="submit" disabled={loading || saving || categories.length === 0}>
            <FiSave /> {saving ? "Guardando..." : "Guardar configuracion"}
          </PrimaryButton>
        </Actions>
      </Card>
      </Page>
    </RootShell>
  );
}

const Page = styled.main`
  min-height: calc(100vh - 64px);
  padding: 28px;
  color: #f8fbff;
`;

const Card = styled.form`
  width: min(760px, 100%);
  margin: 0 auto;
  padding: 22px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.14);
`;

const Header = styled.div`
  margin-bottom: 20px;

  span {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 950;
    text-transform: uppercase;
  }

  h1 {
    margin: 8px 0;
    font-size: clamp(30px, 4vw, 46px);
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.7);
    line-height: 1.6;
  }
`;

const Alert = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  padding: 14px;
  border-radius: 12px;
  color: ${({ $danger }) => ($danger ? "#fecdd3" : "#fde68a")};
  background: ${({ $danger }) => ($danger ? "rgba(127, 29, 29, 0.2)" : "rgba(202, 138, 4, 0.12)")};
  border: 1px solid ${({ $danger }) => ($danger ? "rgba(248, 113, 113, 0.28)" : "rgba(202, 138, 4, 0.26)")};

  p {
    margin: 4px 0 0;
    color: rgba(226, 232, 240, 0.72);
  }
`;

const Success = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 10px;
  color: #86efac;
  background: rgba(22, 163, 74, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.24);
`;

const Label = styled.label`
  display: block;
  margin: 12px 0 7px;
  color: rgba(226, 232, 240, 0.82);
  font-size: 12px;
  font-weight: 850;
`;

const Field = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(2, 6, 23, 0.72);
  color: #00e5ff;

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #fff;
    background: transparent;
  }
`;

const Select = styled.select`
  width: 100%;
  min-height: 44px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  color: #fff;
  background: rgba(2, 6, 23, 0.92);
  padding: 0 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  padding: 12px;
  color: #fff;
  background: rgba(2, 6, 23, 0.72);
  outline: 0;
`;

const ToggleLine = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  min-height: 44px;
  color: rgba(226, 232, 240, 0.82);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 18px;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  color: #03111c;
  background: linear-gradient(135deg, #00e5ff, #22c55e);
  font-weight: 950;
  cursor: pointer;
`;

const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid rgba(0, 229, 255, 0.28);
  color: #e8fbff;
  background: rgba(15, 23, 42, 0.7);
  font-weight: 850;
`;
