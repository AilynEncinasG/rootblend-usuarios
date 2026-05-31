//frontend/src/styles/CreatorStyles.ts
import styled from "styled-components";

export const CreatorPageLayout = styled.main`
  min-height: calc(100vh - 72px);
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--rb-accent) 11%, transparent),
      transparent 34%
    ),
    linear-gradient(180deg, var(--rb-app-overlay-start), var(--rb-app-overlay-end));
  color: var(--rb-text);
  padding: 44px 18px;
  display: flex;
  justify-content: center;
`;

export const CreatorCard = styled.section`
  width: min(900px, 100%);
  background: var(--rb-card-bg);
  border: 1px solid var(--rb-border);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 18px 45px var(--rb-shadow);
  color: var(--rb-text);
`;

export const CreatorHeader = styled.div`
  margin-bottom: 28px;
  text-align: center;

  span {
    color: var(--rb-accent);
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.1em;
  }
`;

export const CreatorTitle = styled.h1`
  margin: 10px 0;
  font-size: 34px;
  line-height: 1.1;
  color: var(--rb-text-strong);
`;

export const CreatorSubtitle = styled.p`
  margin: 0 auto;
  max-width: 680px;
  color: var(--rb-muted);
  line-height: 1.5;
`;

export const CreatorForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CreatorInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CreatorLabel = styled.label`
  font-size: 14px;
  font-weight: 800;
  color: var(--rb-text);
`;

export const CreatorInput = styled.input`
  height: 46px;
  background: var(--rb-input-bg);
  border: 1px solid var(--rb-input-border);
  border-radius: 12px;
  color: var(--rb-text);
  padding: 0 14px;
  outline: none;

  &::placeholder {
    color: var(--rb-muted-soft);
  }

  &:focus {
    border-color: var(--rb-border-strong);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }
`;

export const CreatorTextarea = styled.textarea`
  background: var(--rb-input-bg);
  border: 1px solid var(--rb-input-border);
  border-radius: 12px;
  color: var(--rb-text);
  padding: 14px;
  outline: none;
  resize: vertical;

  &::placeholder {
    color: var(--rb-muted-soft);
  }

  &:focus {
    border-color: var(--rb-border-strong);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }
`;

export const CreatorTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const CreatorTypeCard = styled.button<{ $active?: boolean }>`
  text-align: left;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, color-mix(in srgb, var(--rb-accent) 18%, var(--rb-panel)), color-mix(in srgb, var(--rb-success) 10%, var(--rb-panel)))"
      : "var(--rb-panel)"};
  border: 1px solid ${({ $active }) => ($active ? "var(--rb-border-strong)" : "var(--rb-border)")};
  border-radius: 16px;
  padding: 18px;
  color: var(--rb-text);
  cursor: pointer;
  transition: 0.18s ease;
  box-shadow: ${({ $active }) =>
    $active ? "0 14px 32px color-mix(in srgb, var(--rb-accent) 12%, transparent)" : "none"};

  &:hover {
    transform: translateY(-2px);
    border-color: var(--rb-border-strong);
    background: ${({ $active }) => ($active ? undefined : "var(--rb-card-bg-hover)")};
  }
`;

export const CreatorTypeTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 20px;
  color: var(--rb-text-strong);
`;

export const CreatorTypeDescription = styled.p`
  margin: 0;
  color: var(--rb-muted);
  line-height: 1.45;
`;

export const CreatorButton = styled.button`
  height: 46px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--rb-accent), var(--rb-success));
  color: var(--rb-text-inverse);
  font-weight: 900;
  cursor: pointer;
  padding: 0 18px;
  transition: 0.18s ease;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;

export const CreatorMessage = styled.div<{ $error?: boolean }>`
  background: ${({ $error }) =>
    $error
      ? "color-mix(in srgb, var(--rb-danger) 12%, transparent)"
      : "color-mix(in srgb, var(--rb-accent) 10%, transparent)"};
  border: 1px solid
    ${({ $error }) =>
      $error
        ? "color-mix(in srgb, var(--rb-danger) 35%, transparent)"
        : "color-mix(in srgb, var(--rb-accent) 30%, transparent)"};
  color: ${({ $error }) => ($error ? "var(--rb-danger)" : "var(--rb-accent)")};
  border-radius: 12px;
  padding: 14px;
  font-weight: 700;
`;

export const CreatorExistingBox = styled.div`
  background: var(--rb-panel);
  border: 1px solid var(--rb-border-strong);
  border-radius: 18px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--rb-text);

  h3 {
    margin: 0;
    font-size: 22px;
    color: var(--rb-text-strong);
  }

  p {
    margin: 0;
    color: var(--rb-muted);
  }

  button {
    margin-top: 10px;
    align-self: flex-start;
  }
`;
