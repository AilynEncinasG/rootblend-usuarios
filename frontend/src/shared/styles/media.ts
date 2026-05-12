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

export const ChatBox = styled.div`
  height: calc(100vh - 98px);
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);
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
