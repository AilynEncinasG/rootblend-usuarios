import styled from "styled-components";
import { brandAssets } from "../mock/rootblendMock";

export const AppFrame = styled.div`
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.98), rgba(3, 7, 18, 1)),
    url(${brandAssets.fondo});
  background-size: cover;
  color: #f8fbff;
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

  @media (max-width: 760px) {
    padding: 16px;
  }
`;

export const RightRail = styled.aside`
  border-left: 1px solid rgba(148, 163, 184, 0.1);
  background: rgba(4, 10, 24, 0.7);
  padding: 16px;
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

    span {
      color: #00e5ff;
      display: block;
    }
  }

  p {
    margin: 18px 0 0;
    color: rgba(226, 232, 240, 0.72);
    line-height: 1.6;
  }
`;

export const HeroMedia = styled.div<{ $image: string }>`
  position: relative;
  min-height: 300px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 229, 255, 0.32);
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.1), rgba(2, 6, 23, 0.78)), url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 45px rgba(124, 58, 237, 0.28);
`;

export const HeroOverlay = styled.div`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;

  h3 {
    margin: 8px 0 4px;
    font-size: clamp(22px, 3vw, 34px);
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.76);
  }
`;

export const FeaturedFlag = styled.span`
  position: absolute;
  top: 18px;
  left: 18px;
  padding: 7px 10px;
  border-radius: 8px;
  color: #021016;
  background: #00e5ff;
  font-size: 11px;
  font-weight: 950;
`;

export const PromoPanel = styled.div`
  padding: 16px;
  border-radius: 12px;
  background:
    linear-gradient(135deg, rgba(0, 229, 255, 0.16), rgba(124, 58, 237, 0.13)),
    rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(0, 229, 255, 0.22);

  p {
    color: rgba(226, 232, 240, 0.68);
    font-size: 12px;
    line-height: 1.5;
  }
`;

export const SectionBlock = styled.section`
  margin: 0 0 30px;
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
  }
`;

export const PageHeading = styled.div`
  margin: 0 0 22px;

  h1 {
    margin: 0 0 8px;
    font-size: clamp(30px, 4vw, 46px);
    line-height: 1.04;
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.66);
    line-height: 1.6;
  }
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px 16px;

  span {
    color: rgba(226, 232, 240, 0.6);
  }
`;

export const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  margin: 12px 0;
`;
