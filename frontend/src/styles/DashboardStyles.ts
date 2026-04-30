// frontend/src/styles/DashboardStyles.ts
import styled from "styled-components";

export const DashboardLayout = styled.div`
  display: flex;
  min-height: calc(100vh - 72px);
  background: #0a0b13;
  color: #f5f7fb;
`;

export const SidebarWrapper = styled.aside`
  width: 220px;
  min-width: 220px;
  background: #111322;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 18px 14px;
`;

export const SidebarSectionTitle = styled.h3`
  font-size: 14px;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 18px;
  text-transform: uppercase;
`;

export const SidebarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ChannelItemRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const ChannelAvatar = styled.div`
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #18ff86, #00b7ff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0b13;
  font-weight: 800;
  font-size: 12px;
`;

export const ChannelText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const ChannelName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChannelSubtitle = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 22px 26px 30px;
`;

export const ContentHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 26px;
`;

export const SmallLabel = styled.span`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #00e5ff;
  text-transform: uppercase;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
  font-weight: 800;
  color: #ffffff;
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.62);
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 28px;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 260px;
  height: 42px;
  background: #121526;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0 14px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.38);
  }

  &:focus {
    border-color: #00d1ff;
    box-shadow: 0 0 0 2px rgba(0, 209, 255, 0.12);
  }
`;

export const CategorySelect = styled.select`
  height: 42px;
  background: #121526;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0 14px;
  outline: none;
  min-width: 180px;

  &:focus {
    border-color: #00d1ff;
    box-shadow: 0 0 0 2px rgba(0, 209, 255, 0.12);
  }
`;

export const SectionBlock = styled.section`
  margin-bottom: 34px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
`;

export const SectionCount = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.52);
`;

export const StreamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
`;

export const StreamCardWrapper = styled.article`
  background: #101321;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 229, 255, 0.28);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28);
  }
`;

export const StreamThumb = styled.div`
  position: relative;
  height: 156px;
  background:
    radial-gradient(circle at top right, rgba(0, 255, 234, 0.18), transparent 35%),
    linear-gradient(135deg, #172342 0%, #083d4d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ThumbCenterText = styled.span`
  color: rgba(255, 255, 255, 0.58);
  font-size: 14px;
  font-weight: 700;
`;

export const LiveBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff4f5e;
  color: white;
  font-size: 11px;
  font-weight: 800;
  border-radius: 6px;
  padding: 5px 9px;
`;

export const FeaturedBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #00d1ff;
  color: #08111c;
  font-size: 11px;
  font-weight: 800;
  border-radius: 6px;
  padding: 5px 9px;
`;

export const StreamBody = styled.div`
  padding: 14px 14px 16px;
`;

export const StreamTitle = styled.h3`
  margin: 0 0 8px;
  color: white;
  font-size: 22px;
  line-height: 1.1;
  font-weight: 800;
`;

export const StreamChannel = styled.p`
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
`;

export const StreamCategory = styled.p`
  margin: 0 0 8px;
  color: #00e5ff;
  font-size: 13px;
  font-weight: 700;
`;

export const StreamDescription = styled.p`
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 13px;
  line-height: 1.4;
  min-height: 36px;
`;

export const StreamMetaRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const MetaChip = styled.span`
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
`;

export const FeedbackBox = styled.div`
  background: #101321;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.75);
  padding: 18px;
  border-radius: 14px;
`;