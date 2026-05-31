//frontend/src/shared/styles/navigation.ts
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  height: 64px;
  display: grid;
  grid-template-columns: 250px minmax(220px, 560px) auto;
  align-items: center;
  gap: 22px;
  padding: 0 22px;
  background: color-mix(in srgb, var(--rb-bg-deep) 92%, transparent);
  border-bottom: 1px solid var(--rb-border);
  color: var(--rb-text);
  backdrop-filter: blur(18px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr auto;
  }
`;

export const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--rb-text-strong);
  font-weight: 950;
  font-size: 18px;

  img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  span {
    color: var(--rb-accent);
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

    &::placeholder {
      color: var(--rb-muted-soft);
    }
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
  color: var(--rb-text);
  box-shadow: 0 24px 70px var(--rb-shadow);
  backdrop-filter: blur(18px);
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
  color: var(--rb-text);

  &:hover {
    background: var(--rb-panel-hover);
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: var(--rb-text-strong);
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
  color: var(--rb-muted);
  font-size: 13px;
  font-weight: 850;

  &:hover {
    background: var(--rb-panel-hover);
    color: var(--rb-text-strong);
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
  box-shadow: 0 0 12px color-mix(in srgb, var(--rb-accent-2) 85%, transparent);
`;

export const Sidebar = styled.aside`
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  padding: 18px 14px;
  background: color-mix(in srgb, var(--rb-bg-deep) 88%, transparent);
  border-right: 1px solid var(--rb-border);
  color: var(--rb-text);
  overflow-y: auto;

  @media (max-width: 760px) {
    display: none;
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
  letter-spacing: 0;
`;

export const SidebarEmptyText = styled.p`
  margin: 0;
  padding: 8px;
  color: var(--rb-muted-soft);
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
  color: ${({ $active }) => ($active ? "var(--rb-text-inverse)" : "var(--rb-muted)")};
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, var(--rb-accent), var(--rb-success))" : "transparent"};
  font-size: 13px;
  font-weight: 800;

  &:hover {
    background: ${({ $active }) => ($active ? "linear-gradient(135deg, var(--rb-accent), var(--rb-success))" : "var(--rb-panel-hover)")};
    color: ${({ $active }) => ($active ? "var(--rb-text-inverse)" : "var(--rb-text-strong)")};
  }

  @media (max-width: 1180px) {
    span {
      display: none;
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
  color: var(--rb-text);

  &:hover {
    background: var(--rb-panel-hover);
  }

  @media (max-width: 1180px) {
    grid-template-columns: 34px;

    div,
    span {
      display: none;
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
`;

export const ViewerDot = styled.span`
  color: var(--rb-accent);
  font-size: 11px;
  font-weight: 800;
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

  &:hover {
    background: var(--rb-panel-hover);
    border-color: var(--rb-border-strong);
  }
`;

export const Avatar = styled.div<{ $large?: boolean; $small?: boolean }>`
  width: ${({ $large, $small }) => ($large ? "82px" : $small ? "26px" : "34px")};
  height: ${({ $large, $small }) => ($large ? "82px" : $small ? "26px" : "34px")};
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--rb-text-inverse);
  background: linear-gradient(135deg, var(--rb-accent), var(--rb-accent-2));
  font-size: ${({ $large, $small }) => ($large ? "25px" : $small ? "10px" : "12px")};
  font-weight: 950;
  border: 2px solid color-mix(in srgb, var(--rb-text) 18%, transparent);
`;
