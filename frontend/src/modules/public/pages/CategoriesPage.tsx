import { useEffect, useState } from "react";
import { FiAlertTriangle, FiGrid, FiRefreshCw } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { type Category, type StreamItem } from "../../../shared/mock/rootblendMock";
import {
  getCategories as getBackendCategories,
  getLiveStreams,
} from "../../streams/services/streamsService";
import {
  AlertPanel,
  CategoryCard,
  CategoryGrid,
  Eyebrow,
  PageHeading,
} from "../../../shared/styles/legacyStyled";
import {
  backendCategoryToCard,
  backendStreamToCard,
  EmptyPanel,
} from "../utils/publicLegacyHelpers";

export default function CategoriesPage() {
  const [backendCategories, setBackendCategories] = useState<Category[]>([]);
  const [liveStreams, setLiveStreams] = useState<StreamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setLoading(true);
      setError("");

      try {
        const [categoriesResult, live] = await Promise.all([
          getBackendCategories(),
          getLiveStreams(),
        ]);

        if (!active) return;

        const liveCards = live.map(backendStreamToCard);

        setLiveStreams(liveCards);
        setBackendCategories(
          categoriesResult.map((item) => backendCategoryToCard(item, liveCards))
        );
      } catch (error) {
        console.error("CATEGORIES_LOAD_ERROR", error);

        if (active) {
          setError("No se pudieron cargar las categorías reales.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <RootShell
      active="categories"
    >
      <PageHeading>
        <h1>Categorías de Streams</h1>
        <p>Elige una categoría para encontrar contenido relacionado.</p>
      </PageHeading>

      {error && (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Error al cargar categorías</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      )}

      {loading && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando categorías</strong>
            <p>Cargando categorías disponibles.</p>
          </div>
        </AlertPanel>
      )}

      {backendCategories.length === 0 ? (
        <EmptyPanel
          icon={<FiGrid />}
          title="No hay categorías disponibles"
          text="Cuando existan categorías disponibles, aparecerán aquí."
        />
      ) : (
        <CategoryGrid>
          {backendCategories.map((category) => (
            <CategoryCard
              key={category.id}
              to={`/streams?category=${encodeURIComponent(category.name)}`}
              $image={category.image}
            >
              <span>{category.name}</span>
              <small>{category.viewers} streams activos</small>
            </CategoryCard>
          ))}
        </CategoryGrid>
      )}
    </RootShell>
  );
}