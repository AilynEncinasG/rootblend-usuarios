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
  border: 1px solid rgba(148, 163, 184, 0.13);
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.82)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;

  span {
    font-size: 18px;
    font-weight: 950;
  }

  small {
    margin-top: 4px;
    color: rgba(226, 232, 240, 0.72);
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

export const PermissionLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
`;
