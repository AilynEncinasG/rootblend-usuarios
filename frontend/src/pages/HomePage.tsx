// frontend/src/pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import StreamCard from "../components/dashboard/StreamCard";
import type { Categoria, Stream } from "../services/streamsService";
import {
  getCategories,
  getFeaturedStreams,
  getLiveStreams,
} from "../services/streamsService";
import {
  DashboardLayout,
  MainContent,
  ContentHeader,
  SmallLabel,
  PageTitle,
  PageSubtitle,
  Toolbar,
  SearchInput,
  CategorySelect,
  SectionBlock,
  SectionHeader,
  SectionTitle,
  SectionCount,
  StreamsGrid,
  FeedbackBox,
} from "../styles/DashboardStyles";

export default function HomePage() {
  const [liveStreams, setLiveStreams] = useState<Stream[]>([]);
  const [featuredStreams, setFeaturedStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      setLoading(true);
      setError("");

      try {
        const [liveData, featuredData, categoryData] = await Promise.all([
          getLiveStreams(),
          getFeaturedStreams(),
          getCategories(),
        ]);

        if (!mounted) return;

        setLiveStreams(liveData);
        setFeaturedStreams(featuredData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Error cargando HomePage:", err);

        if (mounted) {
          setError(
            "No se pudo cargar el contenido. Revisa gateway y canales-streaming-service."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredStreams = useMemo(() => {
    return liveStreams.filter((stream) => {
      const matchesCategory =
        selectedCategory === "all" ||
        stream.categoria.id_categoria === selectedCategory;

      const text = `${stream.titulo} ${stream.descripcion || ""} ${
        stream.canal.nombre_canal
      } ${stream.categoria.nombre}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [liveStreams, selectedCategory, search]);

  const filteredFeatured = useMemo(() => {
    return featuredStreams.filter((stream) => {
      const matchesCategory =
        selectedCategory === "all" ||
        stream.categoria.id_categoria === selectedCategory;

      const text = `${stream.titulo} ${stream.descripcion || ""} ${
        stream.canal.nombre_canal
      } ${stream.categoria.nombre}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [featuredStreams, selectedCategory, search]);

  return (
    <>
      <Navbar />

      <DashboardLayout>
        <Sidebar />

        <MainContent>
          <ContentHeader>
            <SmallLabel>RootBlend en vivo</SmallLabel>
            <PageTitle>Explora transmisiones en vivo</PageTitle>
            <PageSubtitle>
              Descubre streams, canales y categorías conectados al microservicio
              de canales a través del gateway.
            </PageSubtitle>
          </ContentHeader>

          <Toolbar>
            <SearchInput
              type="text"
              placeholder="Buscar streams, canales o categorías..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <CategorySelect
              value={selectedCategory}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedCategory(value === "all" ? "all" : Number(value));
              }}
            >
              <option value="all">Todas las categorías</option>

              {categories.map((category) => (
                <option key={category.id_categoria} value={category.id_categoria}>
                  {category.nombre}
                </option>
              ))}
            </CategorySelect>
          </Toolbar>

          {error && <FeedbackBox>{error}</FeedbackBox>}

          {loading && <FeedbackBox>Cargando streams...</FeedbackBox>}

          {!loading && !error && (
            <>
              <SectionBlock>
                <SectionHeader>
                  <SectionTitle>Transmisiones en vivo</SectionTitle>
                  <SectionCount>{filteredStreams.length} disponibles</SectionCount>
                </SectionHeader>

                {filteredStreams.length === 0 ? (
                  <FeedbackBox>No hay streams en vivo para mostrar.</FeedbackBox>
                ) : (
                  <StreamsGrid>
                    {filteredStreams.map((stream) => (
                      <StreamCard key={stream.id_stream} stream={stream} />
                    ))}
                  </StreamsGrid>
                )}
              </SectionBlock>

              <SectionBlock>
                <SectionHeader>
                  <SectionTitle>Destacados</SectionTitle>
                  <SectionCount>{filteredFeatured.length} destacados</SectionCount>
                </SectionHeader>

                {filteredFeatured.length === 0 ? (
                  <FeedbackBox>No hay streams destacados todavía.</FeedbackBox>
                ) : (
                  <StreamsGrid>
                    {filteredFeatured.map((stream) => (
                      <StreamCard key={stream.id_stream} stream={stream} />
                    ))}
                  </StreamsGrid>
                )}
              </SectionBlock>
            </>
          )}
        </MainContent>
      </DashboardLayout>
    </>
  );
}