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
  background: linear-gradient(180deg, rgba(10,14,32,0.96), rgba(7,10,24,0.98));
  border-right: 1px solid rgba(255,255,255,0.06);
  overflow-y: auto;

  @media (max-width: 860px) {
    display: none;
  }
`;

export const SidebarSectionTitle = styled.h3`
  font-size: 0.72rem;
  font-weight: 900;
  color: rgba(255,255,255,0.55);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 14px;
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
  transition: 0.18s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.05);
  }
`;

export const ChannelAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00e5ff, #7c3aed);
  color: #06101b;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ChannelText = styled.div`
  min-width: 0;
`;

export const ChannelName = styled.div`
  font-size: 0.92rem;
  font-weight: 800;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChannelSubtitle = styled.div`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MainContent = styled.main`
  padding: 18px 24px 30px;
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
  color: #00e5ff;
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
  color: #ffffff;
  margin-bottom: 10px;
`;

export const PageSubtitle = styled.p`
  color: rgba(255,255,255,0.68);
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
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  padding: 0 16px;
  outline: none;

  &::placeholder {
    color: rgba(255,255,255,0.42);
  }

  &:focus {
    border-color: rgba(0,229,255,0.45);
  }
`;

export const CategorySelect = styled.select`
  height: 46px;
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  padding: 0 16px;
  outline: none;
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
  color: #ffffff;
`;

export const SectionCount = styled.div`
  font-size: 0.92rem;
  color: #00e5ff;
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
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.74);
`;

export const StreamCardWrapper = styled.article`
  overflow: hidden;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(12,18,44,0.98) 0%, rgba(8,11,28,0.98) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  transition: 0.2s ease;
  box-shadow: 0 12px 36px rgba(0,0,0,0.22);

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(0,229,255,0.25);
    box-shadow: 0 18px 40px rgba(0,0,0,0.3);
  }
`;

export const StreamThumb = styled.div`
  position: relative;
  height: 170px;
  background:
    radial-gradient(circle at top left, rgba(0,229,255,0.15), transparent 30%),
    linear-gradient(135deg, #142a52 0%, #0f2349 35%, #163f55 100%);
`;

export const ThumbCenterText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.6);
  font-size: 0.95rem;
  font-weight: 800;
`;

export const LiveBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 0.74rem;
  font-weight: 900;
  color: #fff;
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
  color: #041019;
  background: linear-gradient(135deg, #00e5ff, #20c8ff);
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
  margin-bottom: 8px;
`;

export const StreamChannel = styled.p`
  font-size: 0.95rem;
  color: rgba(255,255,255,0.82);
  margin-bottom: 8px;
`;

export const StreamCategory = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #00e5ff;
  margin-bottom: 10px;
`;

export const StreamDescription = styled.p`
  font-size: 0.85rem;
  line-height: 1.55;
  color: rgba(255,255,255,0.58);
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
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.7);
  font-size: 0.76rem;
  font-weight: 700;
`;