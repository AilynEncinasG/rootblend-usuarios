//frontend/src/shared/styles/buttons.ts
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
  color: var(--rb-text-inverse);
  background: linear-gradient(135deg, var(--rb-accent), var(--rb-success));
  font-weight: 950;
  font-size: 13px;
  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
`;

export const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid var(--rb-border-strong);
  color: var(--rb-text);
  background: var(--rb-panel);
  font-weight: 850;
  font-size: 13px;
  transition: 0.18s ease;

  &:hover {
    color: var(--rb-text-strong);
    background: var(--rb-panel-hover);
    border-color: var(--rb-accent);
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
  background: color-mix(in srgb, var(--rb-danger) 12%, transparent);
  font-weight: 850;
  font-size: 13px;
  transition: 0.18s ease;

  &:hover {
    background: color-mix(in srgb, var(--rb-danger) 18%, transparent);
    border-color: var(--rb-danger);
  }
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
  color: var(--rb-text-inverse);
  background: linear-gradient(135deg, var(--rb-accent), var(--rb-success));
  font-weight: 950;
  font-size: 13px;
  cursor: pointer;
  transition: 0.18s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.62;
    cursor: not-allowed;
    transform: none;
  }
`;

export const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid var(--rb-border-strong);
  color: var(--rb-text);
  background: var(--rb-panel);
  font-weight: 850;
  font-size: 13px;
  cursor: pointer;
  transition: 0.18s ease;

  &:hover:not(:disabled) {
    color: var(--rb-text-strong);
    background: var(--rb-panel-hover);
    border-color: var(--rb-accent);
  }

  &:disabled {
    opacity: 0.62;
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
  background: color-mix(in srgb, var(--rb-danger) 12%, transparent);
  font-weight: 850;
  font-size: 13px;
  cursor: pointer;
  transition: 0.18s ease;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--rb-danger) 18%, transparent);
    border-color: var(--rb-danger);
  }

  &:disabled {
    opacity: 0.62;
    cursor: not-allowed;
  }
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
  transition: 0.18s ease;

  &:hover {
    color: var(--rb-text-strong);
    background: var(--rb-panel-hover);
    border-color: var(--rb-border-strong);
  }
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
  background: var(--rb-panel);
  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    color: var(--rb-text-strong);
    background: var(--rb-panel-hover);
    border-color: var(--rb-border-strong);
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
  border: 1px solid ${({ $active }) => ($active ? "var(--rb-border-strong)" : "var(--rb-border)")};
  border-radius: 999px;
  padding: 0 13px;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "var(--rb-text-inverse)" : "var(--rb-muted)")};
  background: ${({ $active }) => ($active ? "var(--rb-accent)" : "var(--rb-chip-bg)")};
  font-size: 12px;
  font-weight: 850;
  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    color: ${({ $active }) => ($active ? "var(--rb-text-inverse)" : "var(--rb-text-strong)")};
    border-color: var(--rb-border-strong);
    background: ${({ $active }) => ($active ? "var(--rb-accent)" : "var(--rb-panel-hover)")};
  }
`;

export const TextLink = styled(Link)`
  color: var(--rb-accent);
  font-size: 13px;
  font-weight: 900;
  transition: 0.18s ease;

  &:hover {
    color: var(--rb-text-strong);
  }
`;

export const HeaderActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  a {
    color: var(--rb-muted);
    transition: 0.18s ease;
  }

  a:hover {
    color: var(--rb-text-strong);
  }
`;

export const ChatActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid var(--rb-border);
  border-radius: 8px;
  color: var(--rb-muted);
  background: var(--rb-panel);
  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    color: var(--rb-text-strong);
    background: var(--rb-panel-hover);
    border-color: var(--rb-border-strong);
  }
`;
