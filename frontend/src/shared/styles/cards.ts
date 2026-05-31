//frontend/src/shared/styles/cards.ts
import styled from "styled-components";
import { Link } from "react-router-dom";

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
`;

export const ContentCard = styled(Link)`
  overflow: hidden;
  border-radius: 10px;
  color: var(--rb-text);
  background: var(--rb-card-bg);
  border: 1px solid var(--rb-border);
  box-shadow: 0 16px 34px var(--rb-shadow);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: var(--rb-card-bg-hover);
    border-color: var(--rb-border-strong);
    box-shadow: 0 18px 42px var(--rb-shadow);
    transform: translateY(-2px);
  }
`;

export const Thumb = styled.div<{ $image: string }>`
  position: relative;
  aspect-ratio: 16 / 9;
  background:
    linear-gradient(180deg, color-mix(in srgb, black 5%, transparent), color-mix(in srgb, black 45%, transparent)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`;

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  padding: 4px 7px;
  color: var(--rb-media-text, white);
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
  background: color-mix(in srgb, black 76%, transparent);
  color: #f8fbff;
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
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: var(--rb-muted);
  font-size: 12px;
  font-weight: 800;
`;

export const VerifiedDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--rb-accent);
`;

export const Muted = styled.p`
  margin: 4px 0 0;
  color: var(--rb-muted-soft);
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
  color: var(--rb-text);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--rb-card-bg) 92%, transparent),
      color-mix(in srgb, var(--rb-accent-2) 14%, var(--rb-panel))
    );
  border: 1px solid var(--rb-border);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--rb-shadow) 70%, transparent);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;

  &:hover {
    background:
      linear-gradient(
        135deg,
        var(--rb-card-bg-hover),
        color-mix(in srgb, var(--rb-accent-2) 18%, var(--rb-panel))
      );
    border-color: var(--rb-border-strong);
    transform: translateY(-2px);
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
    linear-gradient(180deg, color-mix(in srgb, black 8%, transparent), color-mix(in srgb, black 42%, transparent)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  color: var(--rb-media-text, white);
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 14px;
  margin-bottom: 30px;
`;

export const CategoryCard = styled(Link)<{ $image: string }>`
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  border-radius: 12px;
  overflow: hidden;
  color: var(--rb-media-text, white);
  border: 1px solid color-mix(in srgb, var(--rb-border-strong) 70%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, black 8%, transparent), color-mix(in srgb, black 82%, transparent)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  box-shadow: 0 16px 40px color-mix(in srgb, var(--rb-shadow) 76%, transparent);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    border-color: var(--rb-border-strong);
    box-shadow: 0 18px 46px var(--rb-shadow);
    transform: translateY(-2px);
  }

  span {
    font-size: 18px;
    font-weight: 950;
  }

  small {
    margin-top: 4px;
    color: var(--rb-media-muted, color-mix(in srgb, white 82%, transparent));
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
  color: var(--rb-media-text, white);
  background:
    linear-gradient(180deg, color-mix(in srgb, black 8%, transparent), color-mix(in srgb, black 86%, transparent)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  border: 1px solid color-mix(in srgb, var(--rb-accent) 42%, transparent);

  h1,
  h2,
  p {
    margin: 0;
  }

  p {
    margin-top: 6px;
    color: var(--rb-media-muted, color-mix(in srgb, white 82%, transparent));
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  overflow-x: auto;
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
  color: var(--rb-text);
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  box-shadow: 0 16px 40px color-mix(in srgb, var(--rb-shadow) 60%, transparent);

  p {
    color: var(--rb-muted);
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
    color: var(--rb-accent);
    font-size: 12px;
    font-weight: 850;
  }
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
  color: var(--rb-text);
  background: var(--rb-panel-hover);
  border: 1px solid transparent;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    background: var(--rb-card-bg-hover);
    border-color: var(--rb-border);
  }

  span {
    font-size: 13px;
    font-weight: 850;
  }

  small {
    color: var(--rb-accent);
    font-weight: 800;
  }
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
  color: var(--rb-text);
  background: var(--rb-card-bg);
  border: 1px solid var(--rb-border);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--rb-shadow) 60%, transparent);

  span,
  small {
    color: var(--rb-muted-soft);
    font-size: 12px;
  }

  strong {
    display: block;
    margin: 6px 0 3px;
    color: var(--rb-text-strong);
    font-size: 27px;
  }

  small {
    color: var(--rb-success);
    font-weight: 850;
  }
`;

export const EpisodeRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  color: var(--rb-text);
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

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  color: var(--rb-text);

  h1 {
    margin: 0;
    color: var(--rb-text-strong);
  }

  p {
    margin: 4px 0 0;
    color: var(--rb-muted-soft);
  }
`;

export const MenuLine = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 9px;
  color: var(--rb-muted);
  transition:
    background 0.18s ease,
    color 0.18s ease;

  &:hover {
    color: var(--rb-text);
    background: var(--rb-panel-hover);
  }
`;

export const NotificationRow = styled.div<{ $accent: string }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: var(--rb-text);
  border-bottom: 1px solid var(--rb-border);

  > svg {
    color: ${({ $accent }) => $accent};
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: var(--rb-text-strong);
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
    color: var(--rb-chip-text);
    background: var(--rb-chip-bg);
    border: 1px solid color-mix(in srgb, var(--rb-accent) 22%, transparent);
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
  box-shadow: 0 18px 48px color-mix(in srgb, var(--rb-shadow) 58%, transparent);

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
  color: var(--rb-text);
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  box-shadow: 0 14px 36px color-mix(in srgb, var(--rb-shadow) 56%, transparent);
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

export const ChartPanel = styled.div`
  height: 260px;
  position: relative;
  margin-bottom: 22px;
  border-radius: 12px;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--rb-accent-2) 12%, transparent),
      color-mix(in srgb, var(--rb-accent) 6%, transparent)
    ),
    var(--rb-card-bg);
  border: 1px solid var(--rb-border);
  box-shadow: 0 18px 48px color-mix(in srgb, var(--rb-shadow) 58%, transparent);

  span {
    position: absolute;
    left: 26px;
    right: 26px;
    bottom: 55px;
    height: 110px;
    border-radius: 50%;
    border-top: 4px solid var(--rb-accent-2);
    filter: drop-shadow(0 0 14px color-mix(in srgb, var(--rb-accent-2) 78%, transparent));
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
  border: 1px dashed color-mix(in srgb, var(--rb-accent-2) 78%, var(--rb-border));
  color: var(--rb-accent-2);
  background: color-mix(in srgb, var(--rb-accent-2) 14%, var(--rb-panel));

  small {
    color: var(--rb-muted-soft);
  }
`;

export const FormCard = styled.form`
  width: min(760px, 100%);
  padding: 20px;
  border-radius: 14px;
  color: var(--rb-text);
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  box-shadow: 0 18px 48px color-mix(in srgb, var(--rb-shadow) 58%, transparent);
`;

export const ToggleLine = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  min-height: 44px;
  color: var(--rb-muted);
`;

export const PermissionLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: var(--rb-text);
  border-bottom: 1px solid var(--rb-border);
`;
