//frontend/src/shared/styles/media.ts
import styled from "styled-components";
import { LiveBadge } from "./cards";

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
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--rb-bg-deep) 5%, transparent),
      color-mix(in srgb, var(--rb-bg-deep) 32%, transparent)
    ),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  box-shadow: 0 16px 42px color-mix(in srgb, var(--rb-shadow) 36%, transparent);

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
  background: color-mix(in srgb, var(--rb-bg-deep) 72%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-border) 70%, transparent);
  backdrop-filter: blur(12px);
`;

export const Progress = styled.div`
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, #ffffff 17%, transparent);
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
  color: var(--rb-text);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoMain = styled.div`
  h1 {
    margin: 0 0 5px;
    font-size: 24px;
    color: var(--rb-text-strong);
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

export const ChatBox = styled.div`
  height: calc(100vh - 98px);
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: var(--rb-card-bg);
  border: 1px solid var(--rb-border);
  color: var(--rb-text);
  box-shadow: 0 14px 36px color-mix(in srgb, var(--rb-shadow) 36%, transparent);
`;

export const ChatStatus = styled.div`
  margin: 0 12px 10px;
  padding: 9px 10px;
  border-radius: 9px;
  color: var(--rb-muted);
  background: color-mix(in srgb, var(--rb-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-accent) 14%, transparent);
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
  color: var(--rb-text);

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
    transition: 0.18s ease;
  }

  button:hover {
    background: var(--rb-panel-hover);
    color: var(--rb-text-strong);
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
    border: 1px solid var(--rb-input-border);
    border-radius: 8px;
    padding: 0 11px;
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
  }

  button {
    border: 0;
    border-radius: 8px;
    color: var(--rb-text-inverse);
    background: var(--rb-accent-2);
    cursor: pointer;
    transition: 0.18s ease;
  }

  button:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  button:disabled {
    opacity: 0.62;
    cursor: not-allowed;
  }
`;

export const LoginNotice = styled.div`
  padding: 12px;
  border-top: 1px solid var(--rb-border);
  color: var(--rb-muted);
  font-size: 13px;

  a {
    color: var(--rb-accent);
    font-weight: 850;
  }
`;

export const ServicePill = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  border-radius: 999px;
  padding: 0 10px;
  color: ${({ $status }) =>
    $status === "Operativo"
      ? "var(--rb-success)"
      : $status === "Degradado"
        ? "var(--rb-warning)"
        : "var(--rb-danger)"};
  background: ${({ $status }) =>
    $status === "Operativo"
      ? "color-mix(in srgb, var(--rb-success) 14%, transparent)"
      : $status === "Degradado"
        ? "color-mix(in srgb, var(--rb-warning) 18%, transparent)"
        : "color-mix(in srgb, var(--rb-danger) 18%, transparent)"};
  border: 1px solid ${({ $status }) =>
    $status === "Operativo"
      ? "color-mix(in srgb, var(--rb-success) 22%, transparent)"
      : $status === "Degradado"
        ? "color-mix(in srgb, var(--rb-warning) 26%, transparent)"
        : "color-mix(in srgb, var(--rb-danger) 26%, transparent)"};
  font-size: 12px;
  font-weight: 850;
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
  background: var(--rb-panel);
  border: 1px solid var(--rb-border-strong);
  color: var(--rb-text);
  box-shadow: 0 16px 42px color-mix(in srgb, var(--rb-shadow) 44%, transparent);
`;
