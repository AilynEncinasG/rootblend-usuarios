/*
  Estilos legacy de ROOTBLEND.

  Archivo generado por phase12-safe-create-legacy-styled.cjs.

  IMPORTANTE:
  - Este archivo copia los styled-components originales.
  - No elimina nada del legacy.
  - No debe exportarse desde shared/styles/index.ts todavía para evitar conflictos
    con layout.ts, buttons.ts, cards.ts, forms.ts, media.ts y feedback.ts.
  - Se usará después cuando extraigamos componentes/páginas reales.
*/

import styled from "styled-components";
import { Link } from "react-router-dom";
import { brandAssets } from "../mock/rootblendMock";

export const AppFrame = styled.div`
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.98), rgba(3, 7, 18, 1)),
    url(${brandAssets.fondo});
  background-size: cover;
  color: #f8fbff;
`;

export const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  height: 64px;
  display: grid;
  grid-template-columns: auto minmax(220px, 560px) auto;
  align-items: center;
  gap: 22px;
  padding: 0 22px;
  background: rgba(3, 7, 18, 0.94);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  backdrop-filter: blur(18px);

  @media (max-height: 500px) and (orientation: landscape) {
    height: 48px; 
    gap: 10px;
    padding: 0 12px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr auto; 
  }
`;

export const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 950;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  span {
    color: #00e5ff;
  }

  @media (max-width: 768px) {
    &:active {
      opacity: 0.7;
      transform: scale(0.98);
    }
  }
`;

export const SearchForm = styled.form`
  height: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.82);
  color: rgba(255, 255, 255, 0.54);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #fff;
    font-size: 13px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

export const TopActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

export const TopPopoverWrap = styled.div`
  position: relative;
`;

export const DropdownPanel = styled.div<{ $wide?: boolean }>`
  position: absolute;
  top: 46px;
  right: 0;
  z-index: 80;
  width: ${({ $wide }) => ($wide ? "360px" : "310px")};
  max-width: calc(100vw - 24px);
  padding: 12px;
  border-radius: 12px;
  background: rgba(7, 12, 27, 0.98);
  border: 1px solid rgba(0, 229, 255, 0.22);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.44);
`;

export const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;

  a {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 850;
  }
`;

export const DropdownItem = styled(Link)`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  min-height: 58px;
  padding: 9px;
  border-radius: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: #fff;
    font-size: 13px;
  }

  small {
    margin-top: 3px;
    color: rgba(226, 232, 240, 0.58);
    font-size: 12px;
  }
`;

export const NotificationMark = styled.span<{ $accent: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $accent }) => $accent};
  box-shadow: 0 0 18px ${({ $accent }) => $accent};
`;

export const DropdownMenuLoading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  color: rgba(226, 232, 240, 0.72);
  font-weight: 900;

  svg {
    color: #00e5ff;
  }
`;

export const DropdownMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 10px;
  border-radius: 9px;
  color: rgba(226, 232, 240, 0.86);
  font-size: 13px;
  font-weight: 850;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }
`;

export const UnreadDot = styled.span`
  position: absolute;
  top: 6px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a855f7;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.9);
`;

export const ShellGrid = styled.div<{ $hasRightPanel: boolean }>`
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) ${({ $hasRightPanel }) => ($hasRightPanel ? "300px" : "0")};
  min-height: calc(100vh - 64px);

  @media (max-width: 1180px) {
    grid-template-columns: 86px minmax(0, 1fr);
    > aside:last-child { display: none; }
  }

  @media (max-width: 768px), (max-height: 500px) {
    grid-template-columns: 1fr !important;
    min-height: calc(100vh - 48px);
  }
`;

interface SidebarProps {
  $isOpen?: boolean;
}

export const Sidebar = styled.aside<SidebarProps>`
  /* --- ESTILOS PARA ESCRITORIO (Base) --- */
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  padding: 18px 14px;
  background: rgba(4, 10, 24, 0.9);
  border-right: 1px solid rgba(148, 163, 184, 0.11);
  overflow-y: auto;

  @media (max-width: 768px), (max-height: 500px) {
    position: fixed;
    top: 0;
    right: 0; 
    width: 280px;
    height: 100vh;
    background: #0f0f0f;
    z-index: 9999;
    padding: 20px;

    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.8);
    overflow-y: auto;

    span, strong, small {
      display: inline-block !important;
      visibility: visible !important;
      opacity: 1 !important;
      color: rgba(226, 232, 240, 0.9) !important;
    }
  }
`;

export const SidebarSection = styled.div`
  margin-bottom: 24px;
`;

export const SidebarTitle = styled.h3`
  margin: 0 0 12px;
  color: rgba(226, 232, 240, 0.62);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0;
`;

export const SidebarEmptyText = styled.p`
  margin: 0;
  padding: 8px;
  color: rgba(226, 232, 240, 0.58);
  font-size: 12px;
  line-height: 1.45;
`;

export const SidebarLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  margin-bottom: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  color: ${({ $active }) => ($active ? "#04111f" : "rgba(226, 232, 240, 0.78)")};
  background: ${({ $active }) => ($active ? "linear-gradient(135deg, #00e5ff, #22c55e)" : "transparent")};
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
  }

  @media (max-width: 1180px) {
    span {
      display: none; 
    }
  }

  @media (max-width: 768px), (max-height: 500px) {
    span {
      display: block !important; 
      color: inherit;
    }
  }
`;

export const ChannelMini = styled(Link)`
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 12px;
  text-decoration: none; 
  color: inherit;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 1180px) {
    grid-template-columns: 34px;

    div,
    span {
      display: none;
    }
  }

  @media (max-width: 768px), (max-height: 500px) {
    grid-template-columns: 34px 1fr auto !important; 

    div,
    span {
      display: block !important; 
    }
  }
`;

export const MiniText = styled.div`
  min-width: 0;

  strong,
  small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    font-size: 13px;
  }

  small {
    color: rgba(226, 232, 240, 0.58);
    font-size: 11px;
  }
`;

export const ViewerDot = styled.span`
  color: #00e5ff;
  font-size: 11px;
  font-weight: 800;
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

export const Eyebrow = styled.span`
  display: inline-flex;
  margin-bottom: 10px;
  color: #00e5ff;
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0;
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

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 18px;
`;

export const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  color: #03111c;
  background: linear-gradient(135deg, #00e5ff, #22c55e);
  font-weight: 950;
  font-size: 13px;
  cursor: pointer;
`;

export const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 229, 255, 0.28);
  color: #e8fbff;
  background: rgba(15, 23, 42, 0.7);
  font-weight: 850;
  font-size: 13px;
`;

export const DangerLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fecdd3;
  background: rgba(127, 29, 29, 0.24);
  font-weight: 850;
  font-size: 13px;
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  color: #03111c;
  background: linear-gradient(135deg, #00e5ff, #22c55e);
  font-weight: 950;
  font-size: 13px;
  cursor: pointer;
`;

export const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 229, 255, 0.28);
  color: #e8fbff;
  background: rgba(15, 23, 42, 0.7);
  font-weight: 850;
  font-size: 13px;
  cursor: pointer;
`;

export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fecdd3;
  background: rgba(127, 29, 29, 0.24);
  font-weight: 850;
  font-size: 13px;
  cursor: pointer;
`;

export const IconRound = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.16);
  cursor: pointer;
`;

export const UserPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 10px 0 4px;
  border-radius: 999px;
  color: #fff;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.16);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
`;

export const Avatar = styled.div<{ $large?: boolean; $small?: boolean }>`
  width: ${({ $large, $small }) => ($large ? "82px" : $small ? "26px" : "34px")};
  height: ${({ $large, $small }) => ($large ? "82px" : $small ? "26px" : "34px")};
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: #04111f;
  background: linear-gradient(135deg, #00e5ff, #8b5cf6);
  font-size: ${({ $large, $small }) => ($large ? "25px" : $small ? "10px" : "12px")};
  font-weight: 950;
  border: 2px solid rgba(255, 255, 255, 0.18);
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

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 24px;
`;

export const FilterChip = styled.button<{ $active?: boolean }>`
  min-height: 32px;
  border: 0;
  border-radius: 999px;
  padding: 0 13px;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "#021016" : "rgba(226, 232, 240, 0.82)")};
  background: ${({ $active }) => ($active ? "#00e5ff" : "rgba(148, 163, 184, 0.12)")};
  font-size: 12px;
  font-weight: 850;
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

export const TextLink = styled(Link)`
  color: #00e5ff;
  font-size: 13px;
  font-weight: 900;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
`;

export const ContentCard = styled(Link)`
  overflow: hidden;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(148, 163, 184, 0.12);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);

  &:hover {
    border-color: rgba(0, 229, 255, 0.38);
    transform: translateY(-2px);
  }
`;

export const Thumb = styled.div<{ $image: string }>`
  position: relative;
  aspect-ratio: 16 / 9;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.05), rgba(2, 6, 23, 0.45)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`;

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  padding: 4px 7px;
  color: #fff;
  background: #ef123f;
  font-size: 10px;
  font-weight: 950;
`;

export const ViewBadge = styled.span`
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.76);
  color: #f8fbff;
  font-size: 11px;
  font-weight: 850;
`;

export const CardBody = styled.div`
  padding: 10px;
`;

export const CardTitle = styled.h3`
  margin: 0 0 7px;
  color: #fff;
  font-size: 14px;
  line-height: 1.25;
`;

export const MetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: rgba(226, 232, 240, 0.82);
  font-size: 12px;
  font-weight: 800;
`;

export const VerifiedDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00e5ff;
`;

export const Muted = styled.p`
  margin: 4px 0 0;
  color: rgba(226, 232, 240, 0.62);
  font-size: 12px;
`;

export const PodcastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
`;

export const PodcastTile = styled(Link)`
  display: grid;
  grid-template-columns: 68px 1fr auto;
  align-items: center;
  gap: 12px;
  min-height: 86px;
  padding: 10px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.86), rgba(88, 28, 135, 0.24));
  border: 1px solid rgba(148, 163, 184, 0.12);
`;

export const PodcastCover = styled.div<{ $image: string }>`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.42)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  color: #fff;
`;

export const RoundButton = styled.button`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  color: #fff;
  background: rgba(15, 23, 42, 0.78);
  cursor: pointer;
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

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const InputWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.74);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #fff;
    background: transparent;
  }
`;

export const Select = styled.select`
  min-height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  color: #fff;
  background: rgba(15, 23, 42, 0.92);
  padding: 0 12px;
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

export const CategoryCard = styled(Link)<{ $image: string }>`
  min-height: 240px; 
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.13);
  text-decoration: none;
  color: white;
  
  background: 
    linear-gradient(180deg, rgba(2, 6, 23, 0) 0%, rgba(2, 6, 23, 0.9) 100%),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.02);
    border-color: rgba(0, 229, 255, 0.5); 
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  }

  span {
    font-size: 24px;
    font-weight: 950;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  small {
    margin-top: 6px;
    font-size: 14px;
    color: rgba(226, 232, 240, 0.85);
    font-weight: 500;
  }
`;

export const ChannelHero = styled.section<{ $image: string }>`
  min-height: 230px;
  display: flex;
  align-items: flex-end;
  gap: 18px;
  margin-bottom: 22px;
  padding: 22px;
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.86)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(0, 229, 255, 0.22);

  h1,
  h2,
  p {
    margin: 0;
  }

  p {
    margin-top: 6px;
    color: rgba(226, 232, 240, 0.74);
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  overflow-x: auto;
`;

export const PlayerPanel = styled.section`
  margin-bottom: 20px;
`;

export const VideoFrame = styled.div<{ $image: string }>`
  position: relative;
  min-height: 470px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.05), rgba(2, 6, 23, 0.26)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;

  > ${LiveBadge} {
    position: absolute;
    top: 14px;
    left: 14px;
  }

  @media (max-width: 900px) {
    min-height: 280px;
  }
`;

export const VideoControls = styled.div`
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.72);
`;

export const Progress = styled.div`
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.17);
  overflow: hidden;

  span {
    display: block;
    width: 42%;
    height: 100%;
    background: #00e5ff;
  }
`;

export const StreamInfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoMain = styled.div`
  h1 {
    margin: 0 0 5px;
    font-size: 24px;
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.68);
  }
`;

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

export const MetaTag = styled.span`
  display: inline-flex;
  min-height: 27px;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  color: #dffaff;
  background: rgba(0, 229, 255, 0.12);
  border: 1px solid rgba(0, 229, 255, 0.16);
  font-size: 12px;
  font-weight: 850;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-bottom: 26px;
`;

export const Panel = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.12);

  p {
    color: rgba(226, 232, 240, 0.68);
    line-height: 1.6;
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  a {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 850;
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

export const ChatBox = styled.div`
  height: calc(100vh - 98px);
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);
`;

export const HeaderActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  a {
    color: rgba(226, 232, 240, 0.74);
  }
`;

export const ChatStatus = styled.div`
  margin: 0 12px 10px;
  padding: 9px 10px;
  border-radius: 9px;
  color: rgba(226, 232, 240, 0.76);
  background: rgba(0, 229, 255, 0.08);
  border: 1px solid rgba(0, 229, 255, 0.14);
  font-size: 12px;
  line-height: 1.4;
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow: auto;
  padding: 12px;
`;

export const ChatRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 26px 1fr 28px;
  gap: 8px;
  margin-bottom: 12px;
`;

export const ChatBubble = styled.div`
  min-width: 0;

  p {
    margin: 3px 0 0;
    color: rgba(226, 232, 240, 0.84);
    font-size: 13px;
    line-height: 1.4;
  }
`;

export const ChatName = styled.div<{ $color: string }>`
  display: flex;
  gap: 6px;
  align-items: center;
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 950;

  span {
    color: #04111f;
    background: #00e5ff;
    border-radius: 4px;
    padding: 1px 4px;
    font-size: 9px;
  }

  time {
    margin-left: auto;
    color: rgba(226, 232, 240, 0.42);
    font-weight: 600;
  }
`;

export const ChatActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 8px;
  color: rgba(226, 232, 240, 0.72);
  background: rgba(2, 6, 23, 0.56);
  cursor: pointer;

  &:hover {
    color: #fff;
    border-color: rgba(0, 229, 255, 0.28);
  }
`;

export const ChatActionMenu = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  z-index: 20;
  width: 210px;
  padding: 8px;
  border-radius: 10px;
  background: rgba(7, 12, 27, 0.98);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.4);

  button {
    width: 100%;
    min-height: 34px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 8px;
    color: rgba(226, 232, 240, 0.86);
    background: transparent;
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
    text-align: left;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
  }
`;

export const ChatForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 38px;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);

  input {
    min-height: 36px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 8px;
    padding: 0 11px;
    color: #fff;
    background: rgba(2, 6, 23, 0.78);
    outline: 0;
  }

  button {
    border: 0;
    border-radius: 8px;
    color: #03111c;
    background: #8b5cf6;
  }
`;

export const LoginNotice = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  color: rgba(226, 232, 240, 0.68);
  font-size: 13px;
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SideListItem = styled(Link)`
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 9px;
  align-items: center;
  padding: 9px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);

  span {
    font-size: 13px;
    font-weight: 850;
  }

  small {
    color: #00e5ff;
    font-weight: 800;
  }
`;

export const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  margin: 12px 0;
`;

export const ServicePill = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  border-radius: 999px;
  padding: 0 10px;
  color: ${({ $status }) => ($status === "Operativo" ? "#86efac" : $status === "Degradado" ? "#fde68a" : "#fecdd3")};
  background: ${({ $status }) => ($status === "Operativo" ? "rgba(22, 163, 74, 0.14)" : $status === "Degradado" ? "rgba(202, 138, 4, 0.18)" : "rgba(220, 38, 38, 0.18)")};
  font-size: 12px;
  font-weight: 850;
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
`;

export const MetricCard = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);

  span,
  small {
    color: rgba(226, 232, 240, 0.64);
    font-size: 12px;
  }

  strong {
    display: block;
    margin: 6px 0 3px;
    font-size: 27px;
  }

  small {
    color: #22c55e;
    font-weight: 850;
  }
`;

export const AudioBar = styled.div`
  position: sticky;
  bottom: 12px;
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(2, 6, 23, 0.92);
  border: 1px solid rgba(0, 229, 255, 0.22);
`;

export const EpisodeRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  button {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 50%;
    color: #03111c;
    background: #00e5ff;
  }

  small {
    color: rgba(226, 232, 240, 0.62);
  }
`;

export const AuthScreen = styled.main<{ $image: string }>`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.74), rgba(2, 6, 23, 0.94)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`;

export const AuthCard = styled.form`
  width: min(440px, 100%);
  padding: 28px;
  border-radius: 14px;
  background: rgba(7, 12, 27, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
`;

export const BrandBlock = styled.div`
  text-align: center;
  margin-bottom: 22px;

  img {
    width: 66px;
  }

  svg {
    width: 42px;
    height: 42px;
    color: #8b5cf6;
  }

  h1 {
    margin: 8px 0 4px;

    span {
      color: #00e5ff;
    }
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.64);
  }
`;

export const Label = styled.label`
  display: block;
  margin: 12px 0 7px;
  color: rgba(226, 232, 240, 0.8);
  font-size: 12px;
  font-weight: 850;
`;

export const Field = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 9px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.76);
  color: #00e5ff;

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #fff;
    background: transparent;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 98px;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  padding: 12px;
  color: #fff;
  background: rgba(15, 23, 42, 0.76);
  outline: 0;
`;

export const FormLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 12px 0;
  color: rgba(226, 232, 240, 0.64);
  font-size: 12px;

  a {
    color: #c084fc;
  }
`;

export const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 9px;
  margin: 12px 0;
`;

export const ChoiceButton = styled.button<{ $active?: boolean }>`
  min-height: 48px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? "#8b5cf6" : "rgba(148, 163, 184, 0.14)")};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(226, 232, 240, 0.76)")};
  background: ${({ $active }) => ($active ? "rgba(124, 58, 237, 0.28)" : "rgba(15, 23, 42, 0.76)")};
  font-weight: 850;
  cursor: pointer;
`;

export const SuccessBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  padding: 11px;
  border-radius: 9px;
  color: #86efac;
  background: rgba(22, 163, 74, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.24);
`;

export const NarrowPanel = styled.div`
  width: min(460px, 100%);
  padding: 18px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;

  h1 {
    margin: 0;
  }

  p {
    margin: 4px 0 0;
    color: rgba(226, 232, 240, 0.62);
  }
`;

export const MenuLine = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 9px;
  color: rgba(226, 232, 240, 0.84);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const NotificationRow = styled.div<{ $accent: string }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  > svg {
    color: ${({ $accent }) => $accent};
  }

  strong,
  small {
    display: block;
  }

  small {
    color: rgba(226, 232, 240, 0.58);
    margin-top: 4px;
  }
`;

export const ProgressSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;

  span {
    padding: 9px;
    border-radius: 999px;
    text-align: center;
    color: #00e5ff;
    background: rgba(0, 229, 255, 0.1);
    font-size: 12px;
    font-weight: 850;
  }
`;

export const ChannelDataPanel = styled.div`
  margin-top: 16px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.14);
  color: rgba(226, 232, 240, 0.78);
  line-height: 1.65;

  strong {
    display: block;
    color: #ffffff;
    font-size: 16px;
    margin-bottom: 10px;
  }

  p {
    margin: 4px 0;
  }

  b {
    color: #00e5ff;
  }
`;

export const CreatorLayout = styled.div`
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const CreatorSidebar = styled.aside`
  padding: 10px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.62);
  border: 1px solid rgba(148, 163, 184, 0.12);
  height: max-content;
`;

export const CreatorMain = styled.div`
  min-width: 0;
`;

export const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
`;

export const ModeratorToolbar = styled.form`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartPanel = styled.div`
  height: 260px;
  position: relative;
  margin-bottom: 22px;
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(139, 92, 246, 0.12), rgba(0, 229, 255, 0.06)),
    rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);

  span {
    position: absolute;
    left: 26px;
    right: 26px;
    bottom: 55px;
    height: 110px;
    border-radius: 50%;
    border-top: 4px solid #8b5cf6;
    filter: drop-shadow(0 0 14px rgba(139, 92, 246, 0.9));
  }
`;

export const UploadZone = styled.div`
  min-height: 130px;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 5px;
  margin: 12px 0;
  border-radius: 12px;
  border: 1px dashed rgba(139, 92, 246, 0.8);
  color: #d8b4fe;
  background: rgba(88, 28, 135, 0.18);

  small {
    color: rgba(226, 232, 240, 0.58);
  }
`;

export const FormCard = styled.form`
  width: min(760px, 100%);
  padding: 20px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);
`;

export const ToggleLine = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  min-height: 44px;
  color: rgba(226, 232, 240, 0.82);
`;

export const AlertPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  padding: 14px;
  border-radius: 12px;
  color: #fde68a;
  background: rgba(202, 138, 4, 0.12);
  border: 1px solid rgba(202, 138, 4, 0.26);

  p {
    margin: 4px 0 0;
    color: rgba(226, 232, 240, 0.7);
  }
`;

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
`;

export const SkeletonCard = styled.div`
  height: 190px;
  border-radius: 12px;
  background:
    linear-gradient(90deg, rgba(148, 163, 184, 0.08), rgba(148, 163, 184, 0.18), rgba(148, 163, 184, 0.08));
  background-size: 200% 100%;
  border: 1px solid rgba(148, 163, 184, 0.1);
  animation: shimmer 1.5s infinite linear;

  @keyframes shimmer {
    from { background-position: 0 0; }
    to { background-position: -200% 0; }
  }
`;

export const StatePanel = styled.div`
  width: min(620px, 100%);
  margin: 60px auto;
  text-align: center;
  padding: 34px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);

  h1,
  h2 {
    margin: 12px 0 8px;
  }

  p {
    color: rgba(226, 232, 240, 0.68);
  }
`;

export const StateIcon = styled.div`
  width: 96px;
  height: 96px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  color: #00e5ff;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.2);

  svg {
    width: 44px;
    height: 44px;
  }

  strong {
    font-size: 36px;
  }
`;

export const DialogCard = styled.div`
  width: min(480px, 100%);
  margin: 30px auto;
  text-align: center;
  padding: 24px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.14);

  p {
    color: rgba(226, 232, 240, 0.68);
  }
`;

export const DangerIcon = styled.div`
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fecdd3;
  background: rgba(220, 38, 38, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.28);

  svg {
    width: 36px;
    height: 36px;
  }
`;

export const ServiceRow = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.7fr 0.8fr 0.5fr 0.8fr;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  small {
    color: rgba(226, 232, 240, 0.62);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    text-align: left;
  }

  th {
    color: rgba(226, 232, 240, 0.62);
    font-size: 11px;
    text-transform: uppercase;
  }
`;

export const PermissionLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
`;
