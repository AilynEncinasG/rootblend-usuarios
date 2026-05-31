//frontend/src/shared/styles/legacyStyled.ts
import styled from "styled-components";
import { Link } from "react-router-dom";
import { brandAssets } from "../mock/rootblendMock";

export const AppFrame = styled.div`
  min-height: 100vh;
  background:
    linear-gradient(180deg, var(--rb-app-overlay-start), var(--rb-app-overlay-end)),
    url(${brandAssets.fondo});
  background-size: cover;
  background-attachment: fixed;
  color: var(--rb-text);
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
  background: color-mix(in srgb, var(--rb-bg-deep) 88%, transparent);
  border-bottom: 1px solid var(--rb-border);
  color: var(--rb-text);
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
  color: var(--rb-text);
  cursor: pointer;

  img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  span {
    color: var(--rb-accent);
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
  border: 1px solid var(--rb-input-border);
  background: var(--rb-input-bg);
  color: var(--rb-muted-soft);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--rb-text);
    font-size: 13px;
  }

  input::placeholder {
    color: var(--rb-muted-soft);
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
  background: var(--rb-panel);
  border: 1px solid var(--rb-border-strong);
  box-shadow: 0 24px 70px var(--rb-shadow);
`;

export const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;

  a {
    color: var(--rb-accent);
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
    background: var(--rb-panel-hover);
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: var(--rb-text);
    font-size: 13px;
  }

  small {
    margin-top: 3px;
    color: var(--rb-muted-soft);
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
  color: var(--rb-muted);
  font-weight: 900;

  svg {
    color: var(--rb-accent);
  }
`;

export const DropdownMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 10px;
  border-radius: 9px;
  color: var(--rb-text);
  font-size: 13px;
  font-weight: 850;

  &:hover {
    background: var(--rb-panel-hover);
    color: var(--rb-text);
  }
`;

export const UnreadDot = styled.span`
  position: absolute;
  top: 6px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--rb-accent-2);
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
   position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  padding: 18px 14px;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--rb-panel) 96%, transparent),
      color-mix(in srgb, var(--rb-panel-strong) 98%, transparent)
    );
  border-right: 1px solid var(--rb-border);
  color: var(--rb-text);
  overflow-y: auto;
  box-shadow: inset -1px 0 0 color-mix(in srgb, var(--rb-border) 70%, transparent);

  [data-theme="light"] &,
  html[data-theme="light"] &,
  body[data-theme="light"] &,
  .light &,
  .theme-light & {
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.9),
        rgba(239, 246, 255, 0.94)
      );
    border-right: 1px solid rgba(15, 23, 42, 0.12);
    color: #0f172a;
    box-shadow: inset -1px 0 0 rgba(15, 23, 42, 0.08);
  }

  @media (max-width: 768px), (max-height: 500px) {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: var(--rb-panel-strong);
    z-index: 9999;
    padding: 20px;
    transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(100%)")};
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 30px var(--rb-shadow);
    overflow-y: auto;

    span,
    strong,
    small {
      display: inline-block !important;
      visibility: visible !important;
      opacity: 1 !important;
      color: inherit !important;
    }
  }
`;

export const SidebarSection = styled.div`
  margin-bottom: 24px;
`;

export const SidebarTitle = styled.h3`
  margin: 0 0 12px;
  color: var(--rb-muted-soft);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  [data-theme="light"] &,
  html[data-theme="light"] &,
  body[data-theme="light"] &,
  .light &,
  .theme-light & {
    color: rgba(15, 23, 42, 0.56);
  }
`;

export const SidebarEmptyText = styled.p`
  margin: 0;
  padding: 8px;
  color: var(--rb-muted-soft);
  font-size: 12px;
  line-height: 1.45;

  [data-theme="light"] &,
  html[data-theme="light"] &,
  body[data-theme="light"] &,
  .light &,
  .theme-light & {
    color: rgba(15, 23, 42, 0.58);
  }
`;

export const SidebarLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  margin-bottom: 6px;
  padding: 8px 10px;
  border-radius: 12px;
  color: ${({ $active }) => ($active ? "var(--rb-text-inverse)" : "var(--rb-muted)")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, var(--rb-accent), var(--rb-success))"
      : "transparent"};
  border: 1px solid ${({ $active }) => ($active ? "var(--rb-border-strong)" : "transparent")};
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: var(--rb-panel-hover);
    color: var(--rb-text-strong);
    border-color: var(--rb-border);
    transform: translateX(2px);
  }

  [data-theme="light"] &,
  html[data-theme="light"] &,
  body[data-theme="light"] &,
  .light &,
  .theme-light & {
    color: ${({ $active }) => ($active ? "#ffffff" : "var(--rb-accent)")};
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #0284c7, #22c55e)"
        : "transparent"};
    border-color: ${({ $active }) => ($active ? "rgba(2, 132, 199, 0.32)" : "transparent")};
    box-shadow: ${({ $active }) =>
      $active ? "0 10px 24px rgba(2, 132, 199, 0.18)" : "none"};
  }

  [data-theme="light"] &:hover,
  html[data-theme="light"] &:hover,
  body[data-theme="light"] &:hover,
  .light &:hover,
  .theme-light &:hover {
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #0284c7, #22c55e)"
        : "rgba(2, 132, 199, 0.08)"};
    color: ${({ $active }) => ($active ? "#ffffff" : "var(--rb-accent)")};
    border-color: rgba(2, 132, 199, 0.2);
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
  color: var(--rb-text);
  border: 1px solid transparent;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: var(--rb-panel-hover);
    border-color: var(--rb-border);
    transform: translateX(2px);
  }

  [data-theme="light"] &,
  html[data-theme="light"] &,
  body[data-theme="light"] &,
  .light &,
  .theme-light & {
    color: #0f172a;
  }

  [data-theme="light"] &:hover,
  html[data-theme="light"] &:hover,
  body[data-theme="light"] &:hover,
  .light &:hover,
  .theme-light &:hover {
    background: rgba(2, 132, 199, 0.08);
    border-color: rgba(2, 132, 199, 0.18);
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
    color: var(--rb-text-strong);
    font-size: 13px;
  }

  small {
    color: var(--rb-muted-soft);
    font-size: 11px;
  }

  [data-theme="light"] & strong,
  html[data-theme="light"] & strong,
  body[data-theme="light"] & strong,
  .light & strong,
  .theme-light & strong {
    color: #0f172a;
  }

  [data-theme="light"] & small,
  html[data-theme="light"] & small,
  body[data-theme="light"] & small,
  .light & small,
  .theme-light & small {
    color: rgba(15, 23, 42, 0.58);
  }
`;

export const ViewerDot = styled.span`
  color: var(--rb-accent);
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
  border-left: 1px solid var(--rb-border);
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

export const Eyebrow = styled.span`
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--rb-accent);
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
  background: linear-gradient(180deg, color-mix(in srgb, var(--rb-bg-deep) 10%, transparent), color-mix(in srgb, var(--rb-bg-deep) 78%, transparent)), url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 45px color-mix(in srgb, var(--rb-accent-2) 24%, transparent);
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
    color: var(--rb-text-strong);
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;

    a,
    button {
      width: 100%;
      max-width: 280px;
    }
  }
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
  color: #ffffff;
  background: linear-gradient(135deg, var(--rb-accent), var(--rb-success));
  font-weight: 950;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--rb-accent) 22%, transparent);
  transition:
    transform 0.18s ease,
    filter 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    color: #ffffff;
    filter: brightness(1.05);
    transform: translateY(-1px);
    box-shadow: 0 14px 30px color-mix(in srgb, var(--rb-accent) 28%, transparent);
  }

  &:visited {
    color: #ffffff;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  width: auto;
  margin-top: 0;

  @media (max-width: 768px) {
    gap: 8px;
    width: 100%;
    justify-content: flex-end;
    
    a {
      font-size: 14px;
      padding: 6px 10px;
      white-space: nowrap;
    }
  }
`;

export const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid var(--rb-border-strong);
  color: var(--rb-text);
  background: var(--rb-panel);
  font-weight: 850;
  font-size: 13px;
  text-decoration: none;
  text-align: center;
  flex: 1;
  transition: all 0.2s ease;

  &:hover {
    background: color-mix(in srgb, var(--rb-accent) 10%, var(--rb-panel));
    border-color: var(--rb-accent);
  }

  @media (max-width: 768px) {
    flex: initial;
    min-height: 32px;
    padding: 0 10px;
    font-size: 11.5px;
    font-weight: 700;
    border-radius: 6px;
  }
`;

export const DangerLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--rb-danger) 45%, transparent);
  color: var(--rb-danger);
  background: color-mix(in srgb, var(--rb-danger) 16%, transparent);
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
  color: #ffffff;
  background: linear-gradient(135deg, var(--rb-accent), var(--rb-success));
  font-weight: 950;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--rb-accent) 22%, transparent);
  transition:
    transform 0.18s ease,
    filter 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    color: #ffffff;
    filter: brightness(1.05);
    transform: translateY(-1px);
    box-shadow: 0 14px 30px color-mix(in srgb, var(--rb-accent) 28%, transparent);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid var(--rb-border-strong);
  color: var(--rb-text);
  background: var(--rb-panel);
  font-weight: 850;
  font-size: 13px;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: var(--rb-accent);
    background: color-mix(in srgb, var(--rb-accent) 10%, var(--rb-panel));
    box-shadow: 0 12px 28px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--rb-danger) 45%, transparent);
  color: var(--rb-danger);
  background: color-mix(in srgb, var(--rb-danger) 16%, transparent);
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
  color: var(--rb-text);
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  cursor: pointer;
`;

export const UserPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 10px 0 4px;
  border-radius: 999px;
  color: var(--rb-text);
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
`;

export const Avatar = styled.div<{ $large?: boolean; $small?: boolean }>`
  width: ${({ $large, $small }) => ($large ? "96px" : $small ? "26px" : "34px")};
  height: ${({ $large, $small }) => ($large ? "96px" : $small ? "26px" : "34px")};
  min-width: ${({ $large, $small }) => ($large ? "96px" : $small ? "26px" : "34px")};
  min-height: ${({ $large, $small }) => ($large ? "96px" : $small ? "26px" : "34px")};
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--rb-text-inverse);
  background: linear-gradient(135deg, var(--rb-accent), var(--rb-accent-2));
  font-size: ${({ $large, $small }) => ($large ? "28px" : $small ? "10px" : "12px")};
  font-weight: 950;
  border: 3px solid var(--rb-border);
  box-shadow:
    0 16px 38px var(--rb-shadow),
    0 0 28px color-mix(in srgb, var(--rb-accent) 16%, transparent);

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: inherit;
  }
`;

export const PromoPanel = styled.div`
  padding: 24px; 
  border-radius: 12px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--rb-accent) 16%, transparent), color-mix(in srgb, var(--rb-accent-2) 13%, transparent)),
    var(--rb-panel);
  border: 1px solid var(--rb-border-strong);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;   
  text-align: center;     

  gap: 12px; 

  strong {
    font-size: 16px; 
    color: var(--rb-text-strong);
  }

  p {
    color: var(--rb-muted);
    font-size: 12px;
    line-height: 1.5;
    margin: 0; 
    max-width: 240px; 
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
  color: ${({ $active }) => ($active ? "var(--rb-text-inverse)" : "var(--rb-muted)")};
  background: ${({ $active }) => ($active ? "var(--rb-accent)" : "var(--rb-chip-bg)")};
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
  color: var(--rb-accent);
  font-size: 13px;
  font-weight: 900;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
`;

export const ContentCard = styled(Link)`
  display: block;
  overflow: hidden;
  border-radius: 14px;
  text-decoration: none;
  color: var(--rb-text);
  background: var(--rb-card-bg);
  border: 1px solid var(--rb-border);
  box-shadow: 0 18px 44px var(--rb-shadow);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    background: var(--rb-card-bg-hover);
    border-color: var(--rb-border-strong);
  }
`;

export const Thumb = styled.div<{ $image: string }>`
  position: relative;
  aspect-ratio: 16 / 9;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--rb-bg-deep) 5%, transparent), color-mix(in srgb, var(--rb-bg-deep) 45%, transparent)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`;

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  padding: 4px 7px;
  color: var(--rb-text);
  background: var(--rb-danger);
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
  background: var(--rb-panel-strong);
  color: var(--rb-text-strong);
  font-size: 11px;
  font-weight: 850;
`;

export const CardBody = styled.div`
  padding: 10px;
`;

export const CardTitle = styled.h3`
  margin: 0 0 7px;
  color: var(--rb-text-strong);
  font-size: 14px;
  line-height: 1.25;
`;

export const MetaLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--rb-muted);
  font-size: 12px;

  span {
    color: var(--rb-muted);
  }
`;

export const VerifiedDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--rb-accent);
`;

export const Muted = styled.p`
  margin: 4px 0 0;
  color: var(--rb-muted);
  font-size: 12px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  word-break: break-word;

  a {
    color: var(--rb-accent);
    text-decoration: none;
    font-weight: 700;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PodcastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
`;

export const PodcastTile = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 14px;
  border-radius: 14px;
  text-decoration: none;
  color: var(--rb-text);
  background: var(--rb-card-bg);
  border: 1px solid var(--rb-border);
  box-shadow: 0 16px 42px var(--rb-shadow);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    background: var(--rb-card-bg-hover);
    border-color: var(--rb-border-strong);
  }

  > div {
    min-width: 0;
  }

  svg {
    color: var(--rb-accent);
    flex: 0 0 auto;
  }
`;

export const PodcastCover = styled.div<{ $image: string }>`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--rb-bg-deep) 8%, transparent), color-mix(in srgb, var(--rb-bg-deep) 42%, transparent)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  color: var(--rb-text);
`;

export const RoundButton = styled.button`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--rb-border);
  border-radius: 50%;
  color: var(--rb-text);
  background: var(--rb-card-bg);
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
    color: var(--rb-muted-soft);
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
  border: 1px solid var(--rb-border);
  background: var(--rb-panel);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: var(--rb-text);
    background: transparent;
  }
`;

export const Select = styled.select`
  min-height: 42px;
  border-radius: 10px;
  border: 1px solid var(--rb-input-border);
  color: var(--rb-text);
  background: var(--rb-input-bg);
  padding: 0 12px;
  outline: 0;

  &:focus {
    border-color: var(--rb-border-strong);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }

  option {
    color: var(--rb-text);
    background: var(--rb-bg);
  }
`;

export const CategoryGrid = styled.div`
  display: grid;
  /* 🌟 Bajamos el mínimo a 240px para que entren perfectamente en cualquier contenedor */
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  width: 100%; /* Asegura que use todo el espacio disponible de la sección */
`;

export const CategoryCard = styled(Link)<{ $image: string }>`
  min-height: 240px; 
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--rb-border);
  text-decoration: none;
  color: white;
  
  background: 
    linear-gradient(180deg, color-mix(in srgb, var(--rb-bg-deep) 0%, transparent) 0%, color-mix(in srgb, var(--rb-bg-deep) 90%, transparent) 100%),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.02);
    border-color: rgba(0, 229, 255, 0.5); 
    box-shadow: 0 10px 20px var(--rb-shadow);
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
    color: var(--rb-text);
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
    linear-gradient(180deg, color-mix(in srgb, var(--rb-bg-deep) 8%, transparent), color-mix(in srgb, var(--rb-bg-deep) 86%, transparent)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  border: 1px solid var(--rb-border-strong);

  h1,
  h2,
  p {
    margin: 0;
  }

  p {
    margin-top: 6px;
    color: var(--rb-muted);
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
  border: 1px solid var(--rb-border);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--rb-bg-deep) 5%, transparent), color-mix(in srgb, var(--rb-bg-deep) 26%, transparent)),
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
  background: var(--rb-panel-strong);
`;

export const Progress = styled.div`
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--rb-accent) 14%, var(--rb-panel));
  overflow: hidden;

  span {
    display: block;
    width: 42%;
    height: 100%;
    background: var(--rb-accent);
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
    color: var(--rb-muted);
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
  color: var(--rb-chip-text);
  background: var(--rb-chip-bg);
  border: 1px solid var(--rb-border-strong);
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
  min-width: 0;
  overflow: hidden;
  padding: 16px;
  border-radius: 12px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  color: var(--rb-text);
  box-shadow: 0 18px 50px var(--rb-shadow);

  p {
    color: var(--rb-muted);
    line-height: 1.6;
  }

  strong,
  h1,
  h2,
  h3 {
    color: var(--rb-text-strong);
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  color: var(--rb-text);

  strong {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--rb-text-strong);
  }

  a {
    color: var(--rb-accent);
    font-weight: 850;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: minmax(130px, 0.42fr) minmax(0, 1fr);
  gap: 12px 18px;
  width: 100%;
  min-width: 0;

  span,
  strong {
    min-width: 0;
  }

  span {
    color: var(--rb-muted-soft);
    font-size: 0.92rem;
  }

  strong {
    color: var(--rb-text);
    font-size: 0.96rem;
    line-height: 1.45;
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: normal;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 6px;

    span {
      margin-top: 10px;
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    strong {
      padding: 10px 12px;
      border-radius: 12px;
      background: var(--rb-panel-strong);
      border: 1px solid var(--rb-border);
    }
  }
`;

export const ProfileBioBox = styled.div`
  width: 100%;
  min-width: 0;
  margin-top: 18px;
  padding: 16px;
  border-radius: 16px;
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--rb-accent) 10%, transparent),
      transparent 36%
    ),
    var(--rb-panel-strong);
  border: 1px solid var(--rb-border);

  span {
    display: block;
    margin-bottom: 8px;
    color: var(--rb-muted-soft);
    font-size: 0.82rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  p {
    margin: 0;
    color: var(--rb-text);
    font-size: 0.96rem;
    line-height: 1.65;
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: normal;
  }

  @media (max-width: 680px) {
    padding: 14px;
    border-radius: 14px;

    p {
      font-size: 0.92rem;
      line-height: 1.6;
    }
  }
`;

export const ResponsiveEmail = styled.strong`
  min-width: 0;
  max-width: 100%;
  display: block;
  color: var(--rb-text);
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: normal;

  @media (max-width: 680px) {
    font-size: clamp(0.72rem, 3.4vw, 0.9rem);
    line-height: 1.35;
  }
`;

export const ChatBox = styled.div`
  height: calc(100vh - 98px);
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
`;

export const HeaderActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  a {
    color: var(--rb-muted);
  }
`;

export const ChatStatus = styled.div`
  margin: 0 12px 10px;
  padding: 9px 10px;
  border-radius: 9px;
  color: var(--rb-muted);
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
    color: var(--rb-text);
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
    color: var(--rb-text-inverse);
    background: var(--rb-accent);
    border-radius: 4px;
    padding: 1px 4px;
    font-size: 9px;
  }

  time {
    margin-left: auto;
    color: var(--rb-muted-soft);
    font-weight: 600;
  }
`;

export const ChatActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid var(--rb-border);
  border-radius: 8px;
  color: var(--rb-muted);
  background: var(--rb-panel-strong);
  cursor: pointer;

  &:hover {
    color: var(--rb-text);
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
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  box-shadow: 0 18px 44px var(--rb-shadow);

  button {
    width: 100%;
    min-height: 34px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 8px;
    color: var(--rb-text);
    background: transparent;
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
    text-align: left;
  }

  button:hover {
    background: var(--rb-panel-hover);
    color: var(--rb-text);
  }
`;

export const ChatForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 38px;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid var(--rb-border);

  input {
    min-height: 36px;
    border: 1px solid var(--rb-border);
    border-radius: 8px;
    padding: 0 11px;
    color: var(--rb-text);
    background: var(--rb-input-bg);
    outline: 0;
  }

  button {
    border: 0;
    border-radius: 8px;
    color: var(--rb-text-inverse);
    background: var(--rb-accent-2);
  }
`;

export const LoginNotice = styled.div`
  padding: 12px;
  border-top: 1px solid var(--rb-border);
  color: var(--rb-muted);
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
  background: color-mix(in srgb, var(--rb-panel-hover) 58%, transparent);

  span {
    font-size: 13px;
    font-weight: 850;
  }

  small {
    color: var(--rb-accent);
    font-weight: 800;
  }
`;

export const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid var(--rb-border);
  margin: 12px 0;
`;

export const ServicePill = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  border-radius: 999px;
  padding: 0 10px;
  color: ${({ $status }) => ($status === "Operativo" ? "var(--rb-success)" : $status === "Degradado" ? "var(--rb-warning)" : "var(--rb-danger)")};
  background: ${({ $status }) => ($status === "Operativo" ? "color-mix(in srgb, var(--rb-success) 14%, transparent)" : $status === "Degradado" ? "color-mix(in srgb, var(--rb-warning) 18%, transparent)" : "color-mix(in srgb, var(--rb-danger) 18%, transparent)")};
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
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);

  span,
  small {
    color: var(--rb-muted-soft);
    font-size: 12px;
  }

  strong {
    display: block;
    margin: 6px 0 3px;
    color: var(--rb-text);
    font-size: 27px;
  }

  small {
    color: var(--rb-success);
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
  background: var(--rb-panel-strong);
  border: 1px solid var(--rb-border-strong);
`;

export const EpisodeRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--rb-border);

  button {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 50%;
    color: var(--rb-text-inverse);
    background: var(--rb-accent);
  }

  small {
    color: var(--rb-muted-soft);
  }
`;

export const AuthScreen = styled.main<{ $image: string }>`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--rb-bg-deep) 74%, transparent), color-mix(in srgb, var(--rb-bg-deep) 94%, transparent)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`;

export const AuthCard = styled.form`
  width: min(440px, 100%);
  padding: 30px;
  border-radius: 18px;
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--rb-accent) 10%, transparent),
      transparent 34%
    ),
    var(--rb-panel);
  border: 1px solid var(--rb-border);
  color: var(--rb-text);
  box-shadow: 0 30px 80px var(--rb-shadow);

  display: flex;
  flex-direction: column;
  gap: 14px;

  label {
    margin: 4px 0 -6px;
  }

  button[type="submit"] {
    width: 100%;
    margin-top: 8px;
  }

  a {
    width: 100%;
  }

  @media (max-width: 520px) {
    width: 100%;
    padding: 24px 18px;
    border-radius: 16px;
    gap: 13px;
  }
`;

export const BrandBlock = styled.div`
  text-align: center;
  margin-bottom: 32px; 

  img {
    width: 66px;
  }

  svg {
    width: 42px;
    height: 42px;
    color: var(--rb-accent);
    margin-bottom: 12px; 
  }

  h1 {
    margin: 12px 0 10px; 
    font-size: 22px;
    color: white;

    span {
      color: var(--rb-accent);
    }
  }

  p {
    margin: 0;
    color: var(--rb-muted-soft);
    font-size: 13px;
    line-height: 1.6; 
  }
`;

export const Label = styled.label`
  display: block;
  margin: 12px 0 7px;
  color: var(--rb-muted);
  font-size: 12px;
  font-weight: 850;
`;

export const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  width: 100%;
  min-width: 0;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid var(--rb-input-border, var(--rb-border));
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--rb-panel) 92%, transparent),
      color-mix(in srgb, var(--rb-panel-strong) 72%, transparent)
    );
  color: var(--rb-accent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--rb-text) 7%, transparent),
    0 10px 28px color-mix(in srgb, var(--rb-shadow) 58%, transparent);
  backdrop-filter: blur(14px);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;

  svg {
    flex: 0 0 auto;
    color: var(--rb-accent);
  }

  &:hover {
    border-color: var(--rb-border-strong);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--rb-panel) 96%, transparent),
        color-mix(in srgb, var(--rb-panel-strong) 86%, transparent)
      );
  }

  &:focus-within {
    border-color: var(--rb-border-strong);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--rb-accent) 15%, transparent),
      0 16px 36px color-mix(in srgb, var(--rb-accent) 11%, transparent);
    background: var(--rb-input-bg, var(--rb-panel-strong));
    transform: translateY(-1px);
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    color: var(--rb-text);
    background: transparent;
    font-weight: 650;
  }

  input::placeholder {
    color: var(--rb-muted-soft);
    font-weight: 500;
  }

  input:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }

  input[type="date"] {
    color-scheme: inherit;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.8;
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--rb-accent) 35%, transparent));
  }

  &:has(input[type="file"]) {
    min-height: 62px;
    align-items: center;
    padding: 10px 12px;
    border-color: var(--rb-border-strong);
    background:
      radial-gradient(
        circle at left,
        color-mix(in srgb, var(--rb-accent) 15%, transparent),
        transparent 42%
      ),
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--rb-panel) 96%, transparent),
        color-mix(in srgb, var(--rb-panel-strong) 82%, transparent)
      );
  }

  input[type="file"] {
    color: var(--rb-muted);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  input[type="file"]::file-selector-button {
    margin-right: 14px;
    min-height: 40px;
    padding: 0 16px;
    border: 0;
    border-radius: 13px;
    color: var(--rb-text-strong);
    background:
      linear-gradient(
        135deg,
        var(--rb-accent),
        var(--rb-accent-2),
        var(--rb-danger)
      );
    font-weight: 950;
    cursor: pointer;
    box-shadow:
      0 12px 28px color-mix(in srgb, var(--rb-accent) 24%, transparent),
      inset 0 1px 0 color-mix(in srgb, var(--rb-text-strong) 20%, transparent);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      filter 0.18s ease;
  }

  input[type="file"]::file-selector-button:hover {
    transform: translateY(-1px);
    filter: brightness(1.08) saturate(1.08);
    box-shadow:
      0 16px 34px color-mix(in srgb, var(--rb-accent-2) 30%, transparent),
      inset 0 1px 0 color-mix(in srgb, var(--rb-text-strong) 24%, transparent);
  }

  input[type="file"]::file-selector-button:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    min-height: 42px;
    border-radius: 11px;
    padding: 0 10px;

    &:has(input[type="file"]) {
      min-height: auto;
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
    }

    input[type="file"] {
      width: 100%;
      font-size: 12px;
    }

    input[type="file"]::file-selector-button {
      width: 100%;
      margin: 0 0 8px;
    }
  }
`;

export const PageCenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  width: 100%;     
  padding: 40px 24px;     
  box-sizing: border-box;
`;

export const FormLimiter = styled.div`
  width: 100%;
  max-width: 600px;
  min-width: 320px;
  box-sizing: border-box;

  h1, h2, title, .title {
    white-space: normal;
    word-break: break-word;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 98px;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid var(--rb-input-border);
  padding: 12px;
  color: var(--rb-text);
  background: var(--rb-input-bg);
  outline: 0;

  &::placeholder {
    color: var(--rb-muted-soft);
  }

  &:focus {
    border-color: var(--rb-border-strong);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }
`;

export const FormLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 12px 0;
  color: var(--rb-muted-soft);
  font-size: 12px;

  a {
    color: var(--rb-accent-2);
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
  border: 1px solid ${({ $active }) => ($active ? "var(--rb-border-strong)" : "var(--rb-border)")};
  color: ${({ $active }) => ($active ? "var(--rb-text-strong)" : "var(--rb-muted)")};
  background: ${({ $active }) => ($active ? "color-mix(in srgb, var(--rb-accent-2) 22%, var(--rb-panel))" : "var(--rb-panel)")};
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
  color: var(--rb-success);
  background: color-mix(in srgb, var(--rb-success) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-success) 24%, transparent);
`;

export const NarrowPanel = styled.div`
  width: min(460px, 100%);
  padding: 18px;
  border-radius: 14px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 22px;
  margin: 8px 0 18px;
  border-radius: 18px;
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--rb-accent-2) 16%, transparent), transparent 42%),
    var(--rb-panel);
  border: 1px solid var(--rb-border);
  text-align: center;
`;

export const ProfileHeroInfo = styled.div`
  min-width: 0;
  flex: 1;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.4rem);
    line-height: 0.95;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  p {
    width: 100%;
    max-width: 680px;
    margin: 0;
    color: var(--rb-text);
    font-size: clamp(0.95rem, 2vw, 1.05rem);
    line-height: 1.65;
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: normal;
  }

  @media (max-width: 760px) {
    align-items: center;
    text-align: center;

    p {
      max-width: 100%;
    }
  }
`;

export const MenuLine = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 9px;
  color: var(--rb-text);

  &:hover {
    background: var(--rb-panel-hover);
  }
`;

export const NotificationRow = styled.div<{ $accent: string }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--rb-border);

  > svg {
    color: ${({ $accent }) => $accent};
  }

  strong,
  small {
    display: block;
  }

  small {
    color: var(--rb-muted-soft);
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
    color: var(--rb-accent);
    background: rgba(0, 229, 255, 0.1);
    font-size: 12px;
    font-weight: 850;
  }
`;

export const ChannelDataPanel = styled.div`
  margin-top: 16px;
  padding: 18px;
  border-radius: 18px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  color: var(--rb-muted);
  line-height: 1.65;

  strong {
    display: block;
    color: var(--rb-text-strong);
    font-size: 16px;
    margin-bottom: 10px;
  }

  p {
    margin: 4px 0;
  }

  b {
    color: var(--rb-accent);
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
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
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
    linear-gradient(180deg, color-mix(in srgb, var(--rb-accent-2) 12%, transparent), color-mix(in srgb, var(--rb-accent) 6%, transparent)),
    var(--rb-panel);
  border: 1px solid var(--rb-border);

  span {
    position: absolute;
    left: 26px;
    right: 26px;
    bottom: 55px;
    height: 110px;
    border-radius: 50%;
    border-top: 4px solid var(--rb-accent-2);
    filter: drop-shadow(0 0 14px color-mix(in srgb, var(--rb-accent-2) 72%, transparent));
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
  border: 1px dashed color-mix(in srgb, var(--rb-accent-2) 70%, var(--rb-border));
  color: var(--rb-accent-2);
  background: color-mix(in srgb, var(--rb-accent-2) 14%, var(--rb-panel));

  small {
    color: var(--rb-muted-soft);
  }
`;

export const FormCard = styled.form`
  width: min(760px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px;
  border-radius: 18px;
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--rb-accent) 12%, transparent),
      transparent 34%
    ),
    var(--rb-panel);
  border: 1px solid var(--rb-border);
  color: var(--rb-text);
  box-shadow: 0 22px 70px var(--rb-shadow);

  @media (max-width: 640px) {
    width: 100%;
    padding: 18px;
    border-radius: 16px;
  }
`;

export const ToggleLine = styled.label`
  width: 100%;
  min-width: 0;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin: 0 0 12px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--rb-border);
  background:
    radial-gradient(
      circle at left,
      color-mix(in srgb, var(--rb-accent) 8%, transparent),
      transparent 34%
    ),
    var(--rb-panel);
  color: var(--rb-text);
  box-shadow: 0 14px 36px color-mix(in srgb, var(--rb-shadow) 58%, transparent);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: var(--rb-border-strong);
    background:
      radial-gradient(
        circle at left,
        color-mix(in srgb, var(--rb-accent) 12%, transparent),
        transparent 38%
      ),
      var(--rb-panel-strong);
  }

  span {
    min-width: 0;
    color: var(--rb-text);
    font-size: 0.95rem;
    font-weight: 850;
    line-height: 1.35;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  input[type="checkbox"] {
    position: relative;
    flex: 0 0 auto;
    width: 62px;
    height: 34px;
    margin: 0;
    appearance: none;
    border-radius: 999px;
    border: 1px solid var(--rb-border);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--rb-muted-soft) 24%, transparent),
        color-mix(in srgb, var(--rb-panel-strong) 88%, transparent)
      );
    box-shadow:
      inset 0 2px 8px color-mix(in srgb, var(--rb-shadow) 70%, transparent),
      0 8px 20px color-mix(in srgb, var(--rb-shadow) 40%, transparent);
    cursor: pointer;
    outline: none;
    transition:
      background 0.22s ease,
      border-color 0.22s ease,
      box-shadow 0.22s ease;
  }

  input[type="checkbox"]::before {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: var(--rb-text);
    box-shadow:
      0 8px 18px color-mix(in srgb, var(--rb-shadow) 70%, transparent),
      inset 0 1px 0 color-mix(in srgb, var(--rb-text-strong) 28%, transparent);
    transition:
      transform 0.22s ease,
      background 0.22s ease;
  }

  input[type="checkbox"]::after {
    content: "NO";
    position: absolute;
    top: 50%;
    right: 9px;
    transform: translateY(-50%);
    color: var(--rb-muted);
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.04em;
    transition:
      left 0.22s ease,
      right 0.22s ease,
      color 0.22s ease;
  }

  input[type="checkbox"]:checked {
    border-color: color-mix(in srgb, var(--rb-accent) 70%, var(--rb-border));
    background: linear-gradient(
      135deg,
      var(--rb-accent),
      var(--rb-accent-2),
      var(--rb-success)
    );
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent),
      0 12px 28px color-mix(in srgb, var(--rb-accent) 22%, transparent);
  }

  input[type="checkbox"]:checked::before {
    transform: translateX(28px);
    background: var(--rb-text-strong);
  }

  input[type="checkbox"]:checked::after {
    content: "SÍ";
    right: auto;
    left: 10px;
    color: var(--rb-text-strong);
  }

  input[type="checkbox"]:focus-visible {
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--rb-accent) 20%, transparent),
      0 12px 28px color-mix(in srgb, var(--rb-accent) 18%, transparent);
  }

  input[type="checkbox"]:disabled {
    cursor: not-allowed;
    opacity: 0.52;
    filter: grayscale(0.3);
  }

  &:has(input[type="checkbox"]:disabled) {
    cursor: not-allowed;
    opacity: 0.72;
  }

  &:has(input[type="checkbox"]:checked) {
    border-color: color-mix(in srgb, var(--rb-accent) 45%, var(--rb-border));
    background:
      radial-gradient(
        circle at right,
        color-mix(in srgb, var(--rb-accent) 15%, transparent),
        transparent 42%
      ),
      var(--rb-panel);
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    gap: 14px;
    padding: 14px;
    border-radius: 14px;

    span {
      font-size: 0.9rem;
    }

    input[type="checkbox"] {
      width: 58px;
      height: 32px;
    }

    input[type="checkbox"]::before {
      width: 22px;
      height: 22px;
    }

    input[type="checkbox"]:checked::before {
      transform: translateX(26px);
    }
  }
`;

export const AlertPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  padding: 14px;
  border-radius: 12px;
  color: var(--rb-warning);
  background: color-mix(in srgb, var(--rb-warning) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-warning) 30%, transparent);

  strong {
    color: var(--rb-text-strong);
  }

  p {
    margin: 4px 0 0;
    color: var(--rb-muted);
  }

  svg {
    flex: 0 0 auto;
  }
`;

export const CentralizerLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 140px);
  width: 100%;
  padding: 24px;
  box-sizing: border-box;

  & > div {
    width: 100%;
    max-width: 540px; 
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    linear-gradient(90deg, color-mix(in srgb, var(--rb-border) 35%, transparent), color-mix(in srgb, var(--rb-border-strong) 50%, transparent), color-mix(in srgb, var(--rb-border) 35%, transparent));
  background-size: 200% 100%;
  border: 1px solid var(--rb-border);
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
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  color: var(--rb-text);
  box-shadow: 0 18px 50px var(--rb-shadow);

  h1,
  h2 {
    margin: 12px 0 8px;
    color: var(--rb-text-strong);
  }

  p {
    color: var(--rb-muted);
  }
`;

export const StateIcon = styled.div`
  width: 96px;
  height: 96px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  color: var(--rb-accent);
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid var(--rb-border-strong);

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
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);

  p {
    color: var(--rb-muted);
  }
`;

export const DangerIcon = styled.div`
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--rb-danger);
  background: color-mix(in srgb, var(--rb-danger) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-danger) 28%, transparent);

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
  border-bottom: 1px solid var(--rb-border);

  small {
    color: var(--rb-muted-soft);
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
    border-bottom: 1px solid var(--rb-border);
    text-align: left;
  }

  th {
    color: var(--rb-muted-soft);
    font-size: 11px;
    text-transform: uppercase;
  }
`;

export const PermissionLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid var(--rb-border);
`;