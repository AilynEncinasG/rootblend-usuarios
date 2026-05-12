import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiRefreshCw,
  FiSearch,
  FiWifiOff,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { type Category, type StreamItem } from "../../../shared/mock/rootblendMock";
import {
  getCategories as getBackendCategories,
  getLiveStreams,
} from "../../streams/services/streamsService";
import {
  AlertPanel,
  CardGrid,
  Eyebrow,
  InputWrap,
  PageHeading,
  Select,
  Toolbar,
} from "../../../shared/styles/legacyStyled";
import {
  backendCategoryToCard,
  backendStreamToCard,
  EmptyPanel,
  StreamCard,
} from "../utils/publicLegacyHelpers";

export default function ExploreStreamsPage() {
  const [params] = useSearchParams();

  const initialCategory = params.get("category") || "Todos";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [liveStreams, setLiveStreams] = useState<StreamItem[]>([]);
  const [backendCategories, setBackendCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStreams() {
      setLoading(true);
      setError("");

      try {
        const [live, categoriesResult] = await Promise.all([
          getLiveStreams(),
          getBackendCategories(),
        ]);

        if (!active) return;

        const liveCards = live.map(backendStreamToCard);

        setLiveStreams(liveCards);
        setBackendCategories(
          categoriesResult.map((item) => backendCategoryToCard(item, liveCards))
        );
      } catch (error) {
        console.error("EXPLORE_STREAMS_LOAD_ERROR", error);

        if (active) {
          setError("No se pudieron cargar las transmisiones reales.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStreams();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return liveStreams.filter((stream) => {
      const text =
        `${stream.title} ${stream.channel} ${stream.category}`.toLowerCase();
      const bySearch = text.includes(search.toLowerCase());
      const byCategory = category === "Todos" || stream.category === category;

      return bySearch && byCategory;
    });
  }, [category, liveStreams, search]);

  return (
    <RootShell active="streams">
      <PageHeading>
        <Eyebrow>Explorar</Eyebrow>
        <h1>Explorar transmisiones en vivo</h1>
        <p>
          Esta sección muestra las transmisiones que están en vivo en este
          momento.
        </p>
      </PageHeading>

      {error && (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Error al cargar streams</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      )}

      {loading && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando</strong>
            <p>Buscando transmisiones disponibles...</p>
          </div>
        </AlertPanel>
      )}

      <Toolbar>
        <InputWrap>
          <FiSearch />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar stream real..."
          />
        </InputWrap>

        <Select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option>Todos</option>
          {backendCategories.map((item) => (
            <option key={item.id}>{item.name}</option>
          ))}
        </Select>
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyPanel
          icon={<FiWifiOff />}
          title="No hay streams en vivo"
          text="Cuando un streamer inicie una transmisión, aparecerá en este listado."
        />
      ) : (
        <CardGrid>
          {filtered.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </CardGrid>
      )}
    </RootShell>
  );
}