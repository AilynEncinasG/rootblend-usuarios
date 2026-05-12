import { RootShell } from "../../../shared/layout";
import { Eyebrow, PageHeading, SkeletonCard, SkeletonGrid } from "../../../shared/styles/legacyStyled";
export default function LoadingDemoPage() {
  return (
    <RootShell active="system">
      <PageHeading><Eyebrow>Estado global</Eyebrow><h1>Cargando contenido</h1><p>Skeleton para cuando el gateway aun esta respondiendo.</p></PageHeading>
      <SkeletonGrid>{Array.from({ length: 8 }, (_, index) => <SkeletonCard key={index} />)}</SkeletonGrid>
    </RootShell>
  );
}
