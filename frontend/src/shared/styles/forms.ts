// frontend/src/shared/styles/forms.ts
import styled from "styled-components";

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const InputWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid var(--rb-input-border);
  background: var(--rb-input-bg);
  color: var(--rb-accent);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: var(--rb-text);
    background: transparent;
  }

  input::placeholder {
    color: var(--rb-muted-soft);
  }
`;

export const Select = styled.select`
  min-height: 42px;
  border-radius: 10px;
  border: 1px solid var(--rb-input-border);
  color: var(--rb-text);
  background: var(--rb-input-bg);
  padding: 0 12px;
  outline: 0;

  &:focus {
    border-color: var(--rb-border-strong);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }

  option {
    color: var(--rb-text);
    background: var(--rb-panel-strong);
  }
`;

export const AuthScreen = styled.main<{ $image: string }>`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    linear-gradient(180deg, var(--rb-app-overlay-start), var(--rb-app-overlay-end)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  color: var(--rb-text);
`;

export const AuthCard = styled.form`
  width: min(440px, 100%);
  padding: 28px;
  border-radius: 14px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  box-shadow: 0 30px 80px var(--rb-shadow);
  color: var(--rb-text);
`;

export const BrandBlock = styled.div`
  text-align: center;
  margin-bottom: 22px;

  img {
    width: 66px;
  }

  svg {
    width: 42px;
    height: 42px;
    color: var(--rb-accent-2);
  }

  h1 {
    margin: 8px 0 4px;
    color: var(--rb-text-strong);

    span {
      color: var(--rb-accent);
    }
  }

  p {
    margin: 0;
    color: var(--rb-muted);
  }
`;

export const Label = styled.label`
  display: block;
  margin: 12px 0 7px;
  color: var(--rb-muted);
  font-size: 12px;
  font-weight: 850;
`;

export const Field = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 9px;
  border: 1px solid var(--rb-input-border);
  background: var(--rb-input-bg);
  color: var(--rb-accent);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: var(--rb-text);
    background: transparent;
  }

  input::placeholder {
    color: var(--rb-muted-soft);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 98px;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid var(--rb-input-border);
  padding: 12px;
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
`;

export const FormLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 12px 0;
  color: var(--rb-muted);
  font-size: 12px;

  a {
    color: var(--rb-accent-2);
  }
`;

export const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 9px;
  margin: 12px 0;
`;

export const ChoiceButton = styled.button<{ $active?: boolean }>`
  min-height: 48px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? "var(--rb-accent-2)" : "var(--rb-border)")};
  color: ${({ $active }) => ($active ? "var(--rb-text-inverse)" : "var(--rb-muted)")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, var(--rb-accent-2), var(--rb-accent))"
      : "var(--rb-panel)"};
  font-weight: 850;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    border-color: var(--rb-border-strong);
    background: ${({ $active }) => ($active ? undefined : "var(--rb-panel-hover)")};
    transform: translateY(-1px);
  }
`;

export const SuccessBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  padding: 11px;
  border-radius: 9px;
  color: var(--rb-success);
  background: color-mix(in srgb, var(--rb-success) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-success) 24%, transparent);
`;

export const NarrowPanel = styled.div`
  width: min(460px, 100%);
  padding: 18px;
  border-radius: 14px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  color: var(--rb-text);
  box-shadow: 0 18px 50px var(--rb-shadow);
`;

export const ModeratorToolbar = styled.form`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
