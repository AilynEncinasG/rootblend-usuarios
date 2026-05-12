import styled from "styled-components";
import { Link } from "react-router-dom";

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

export const TextLink = styled(Link)`
  color: #00e5ff;
  font-size: 13px;
  font-weight: 900;
`;

export const HeaderActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  a {
    color: rgba(226, 232, 240, 0.74);
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
