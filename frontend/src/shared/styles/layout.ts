//frontend/src/shared/styles/layout.ts
import styled from "styled-components";
import { brandAssets } from "../mock/rootblendMock";

export const AppFrame = styled.div`
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--rb-app-overlay-start) 94%, transparent),
      color-mix(in srgb, var(--rb-app-overlay-end) 98%, transparent)
    ),
    url(${brandAssets.fondo});
  background-size: cover;
  color: var(--rb-text);
`;

export const ShellGrid = styled.div<{ $hasRightPanel: boolean }>`
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) ${({ $hasRightPanel }) => ($hasRightPanel ? "300px" : "0")};
  min-height: calc(100vh - 64px);

  @media (max-width: 1180px) {
    grid-template-columns: 86px minmax(0, 1fr);

    > aside:last-child {
      display: none;
    }
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const MainArea = styled.main`
  padding: 24px;
  min-width: 0;
  color: var(--rb-text);

  @media (max-width: 760px) {
    padding: 16px;
  }
`;

export const RightRail = styled.aside`
  border-left: 1px solid var(--rb-border);
  background: color-mix(in srgb, var(--rb-panel) 72%, transparent);
  padding: 16px;
  color: var(--rb-text);
`;

export const HeroGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.3fr);
  gap: 28px;
  align-items: center;
  margin-bottom: 26px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCopy = styled.div`
  max-width: 620px;

  h1 {
    margin: 0;
    font-size: clamp(36px, 6vw, 64px);
    line-height: 0.98;
    font-weight: 950;
    color: var(--rb-text-strong);

    span {
      color: var(--rb-accent);
      display: block;
    }
  }

  p {
    margin: 18px 0 0;
    color: var(--rb-muted);
    line-height: 1.6;
  }
`;

export const HeroMedia = styled.div<{ $image: string }>`
  position: relative;
  min-height: 300px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--rb-border-strong);
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--rb-bg-deep) 10%, transparent),
      color-mix(in srgb, var(--rb-bg-deep) 72%, transparent)
    ),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 45px color-mix(in srgb, var(--rb-accent-2) 24%, transparent);
`;

export const HeroOverlay = styled.div`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;
  color: var(--rb-media-text, white);

  h3 {
    margin: 8px 0 4px;
    font-size: clamp(22px, 3vw, 34px);
    color: var(--rb-media-text, white);
    text-shadow: 0 2px 18px rgba(0, 0, 0, 0.34);
  }

  p {
    margin: 0;
    color: var(--rb-media-muted, color-mix(in srgb, white 82%, transparent));
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.28);
  }
`;

export const FeaturedFlag = styled.span`
  position: absolute;
  top: 18px;
  left: 18px;
  padding: 7px 10px;
  border-radius: 8px;
  color: var(--rb-text-inverse);
  background: var(--rb-accent);
  font-size: 11px;
  font-weight: 950;
`;

export const PromoPanel = styled.div`
  padding: 16px;
  border-radius: 12px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--rb-accent) 16%, transparent),
      color-mix(in srgb, var(--rb-accent-2) 13%, transparent)
    ),
    var(--rb-panel);
  border: 1px solid color-mix(in srgb, var(--rb-accent) 22%, transparent);
  color: var(--rb-text);

  p {
    color: var(--rb-muted);
    font-size: 12px;
    line-height: 1.5;
  }
`;

export const SectionBlock = styled.section`
  margin: 0 0 30px;
  color: var(--rb-text);
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;

  h2 {
    margin: 0;
    font-size: 22px;
    color: var(--rb-text-strong);
  }
`;

export const PageHeading = styled.div`
  margin: 0 0 22px;

  h1 {
    margin: 0 0 8px;
    font-size: clamp(30px, 4vw, 46px);
    line-height: 1.04;
    color: var(--rb-text-strong);
  }

  p {
    margin: 0;
    color: var(--rb-muted);
    line-height: 1.6;
  }
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px 16px;
  color: var(--rb-text);

  span {
    color: var(--rb-muted-soft);
  }
`;

export const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid var(--rb-border);
  margin: 12px 0;
`;