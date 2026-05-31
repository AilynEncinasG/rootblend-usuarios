//frontend/src/styles/DashboardStyles.ts
import { styled } from "styled-components";

export const DashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 270px 1fr;
  min-height: calc(100vh - 72px);

  @media (max-width: 1100px) {
    grid-template-columns: 92px 1fr;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const SidebarWrapper = styled.aside`
  position: sticky;
  top: 72px;
  height: calc(100vh - 72px);
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
        rgba(255, 255, 255, 0.86),
        rgba(239, 246, 255, 0.92)
      );
    border-right: 1px solid rgba(15, 23, 42, 0.12);
    color: #0f172a;
    box-shadow: inset -1px 0 0 rgba(15, 23, 42, 0.08);
  }

  @media (max-width: 860px) {
    display: none;
  }
`;

export const SidebarSectionTitle = styled.h3`
  font-size: 0.72rem;
  font-weight: 900;
  color: var(--rb-muted-soft);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 14px;

  [data-theme="light"] &,
  html[data-theme="light"] &,
  body[data-theme="light"] &,
  .light &,
  .theme-light & {
    color: rgba(15, 23, 42, 0.55);
  }
`;

export const SidebarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 22px;
`;

export const ChannelItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 14px;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    background: var(--rb-panel-hover);
    border-color: var(--rb-border);
    transform: translateX(2px);
  }

  [data-theme="light"] &:hover,
  html[data-theme="light"] &:hover,
  body[data-theme="light"] &:hover,
  .light &:hover,
  .theme-light &:hover {
    background: rgba(2, 132, 199, 0.08);
    border-color: rgba(2, 132, 199, 0.18);
  }
`;

export const ChannelAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--rb-accent), var(--rb-accent-2));
  color: var(--rb-text-inverse);
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--rb-accent) 20%, transparent);
`;

export const ChannelText = styled.div`
  min-width: 0;
`;

export const ChannelName = styled.div`
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--rb-text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  [data-theme="light"] &,
  html[data-theme="light"] &,
  body[data-theme="light"] &,
  .light &,
  .theme-light & {
    color: #0f172a;
  }
`;

export const ChannelSubtitle = styled.div`
  font-size: 0.78rem;
  color: var(--rb-muted-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  [data-theme="light"] &,
  html[data-theme="light"] &,
  body[data-theme="light"] &,
  .light &,
  .theme-light & {
    color: rgba(15, 23, 42, 0.58);
  }
`;

export const MainContent = styled.main`
  padding: 18px 24px 30px;
  color: var(--rb-text);
  overflow: hidden;

  @media (max-width: 860px) {
    padding: 18px 14px 26px;
  }
`;

export const ContentHeader = styled.div`
  margin-bottom: 22px;
  text-align: center;
`;

export const SmallLabel = styled.div`
  color: var(--rb-accent);
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 10px;
`;

export const PageTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1;
  font-weight: 900;
  color: var(--rb-text-strong);
  margin-bottom: 10px;
`;

export const PageSubtitle = styled.p`
  color: var(--rb-muted);
  max-width: 760px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 46px;
  border-radius: 14px;
  background: var(--rb-input-bg);
  border: 1px solid var(--rb-input-border);
  color: var(--rb-text);
  padding: 0 16px;
  outline: none;

  &::placeholder {
    color: var(--rb-muted-soft);
  }

  &:focus {
    border-color: var(--rb-border-strong);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }
`;

export const CategorySelect = styled.select`
  height: 46px;
  border-radius: 14px;
  background: var(--rb-input-bg);
  border: 1px solid var(--rb-input-border);
  color: var(--rb-text);
  padding: 0 16px;
  outline: none;

  &:focus {
    border-color: var(--rb-border-strong);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }

  option {
    background: var(--rb-panel);
    color: var(--rb-text);
  }
`;

export const SectionBlock = styled.section`
  margin-bottom: 34px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--rb-text-strong);
`;

export const SectionCount = styled.div`
  font-size: 0.92rem;
  color: var(--rb-accent);
  font-weight: 700;
`;

export const StreamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
  gap: 16px;
`;

export const FeedbackBox = styled.div`
  padding: 18px;
  border-radius: 18px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  color: var(--rb-muted);
  box-shadow: 0 12px 34px var(--rb-shadow);
`;

export const StreamCardWrapper = styled.article`
  overflow: hidden;
  border-radius: 22px;
  background: var(--rb-card-bg);
  border: 1px solid var(--rb-border);
  color: var(--rb-text);
  transition: 0.2s ease;
  box-shadow: 0 12px 36px var(--rb-shadow);

  &:hover {
    transform: translateY(-3px);
    background: var(--rb-card-bg-hover);
    border-color: var(--rb-border-strong);
    box-shadow: 0 18px 40px var(--rb-shadow);
  }
`;

export const StreamThumb = styled.div`
  position: relative;
  height: 170px;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--rb-accent) 18%, transparent), transparent 30%),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--rb-accent) 20%, var(--rb-bg-deep)) 0%,
      color-mix(in srgb, var(--rb-accent-2) 22%, var(--rb-bg-deep)) 45%,
      color-mix(in srgb, var(--rb-success) 18%, var(--rb-bg-deep)) 100%
    );
`;

export const ThumbCenterText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: color-mix(in srgb, var(--rb-text) 72%, transparent);
  font-size: 0.95rem;
  font-weight: 800;
`;

export const LiveBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 0.74rem;
  font-weight: 900;
  color: var(--rb-text-inverse);
  background: linear-gradient(135deg, #ff4b5c, #ff6b7d);
  border-radius: 9px;
  padding: 6px 10px;
`;

export const FeaturedBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.74rem;
  font-weight: 900;
  color: var(--rb-text-inverse);
  background: linear-gradient(135deg, var(--rb-accent), color-mix(in srgb, var(--rb-accent) 72%, #20c8ff));
  border-radius: 9px;
  padding: 6px 10px;
`;

export const StreamBody = styled.div`
  padding: 16px;
`;

export const StreamTitle = styled.h3`
  font-size: 1.08rem;
  line-height: 1.2;
  font-weight: 900;
  color: var(--rb-text-strong);
  margin-bottom: 8px;
`;

export const StreamChannel = styled.p`
  font-size: 0.95rem;
  color: var(--rb-muted);
  margin-bottom: 8px;
`;

export const StreamCategory = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--rb-accent);
  margin-bottom: 10px;
`;

export const StreamDescription = styled.p`
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--rb-muted-soft);
  min-height: 44px;
  margin-bottom: 14px;
`;

export const StreamMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const MetaChip = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--rb-chip-bg);
  color: var(--rb-chip-text);
  border: 1px solid var(--rb-border);
  font-size: 0.76rem;
  font-weight: 700;
`;