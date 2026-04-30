import styled from "styled-components";

export const CreatorPageLayout = styled.main`
  min-height: calc(100vh - 72px);
  background:
    radial-gradient(circle at top, rgba(0, 229, 255, 0.08), transparent 32%),
    #090a12;
  color: #ffffff;
  padding: 44px 18px;
  display: flex;
  justify-content: center;
`;

export const CreatorCard = styled.section`
  width: min(900px, 100%);
  background: #111322;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
`;

export const CreatorHeader = styled.div`
  margin-bottom: 28px;
  text-align: center;

  span {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.1em;
  }
`;

export const CreatorTitle = styled.h1`
  margin: 10px 0;
  font-size: 34px;
  line-height: 1.1;
`;

export const CreatorSubtitle = styled.p`
  margin: 0 auto;
  max-width: 680px;
  color: rgba(255, 255, 255, 0.62);
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
  color: rgba(255, 255, 255, 0.88);
`;

export const CreatorInput = styled.input`
  height: 46px;
  background: #0c0e19;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #ffffff;
  padding: 0 14px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.34);
  }

  &:focus {
    border-color: #00e5ff;
    box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.12);
  }
`;

export const CreatorTextarea = styled.textarea`
  background: #0c0e19;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #ffffff;
  padding: 14px;
  outline: none;
  resize: vertical;

  &::placeholder {
    color: rgba(255, 255, 255, 0.34);
  }

  &:focus {
    border-color: #00e5ff;
    box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.12);
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
      ? "linear-gradient(135deg, rgba(0, 229, 255, 0.18), rgba(0, 255, 153, 0.08))"
      : "#0c0e19"};
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(0, 229, 255, 0.65)" : "rgba(255, 255, 255, 0.08)"};
  border-radius: 16px;
  padding: 18px;
  color: #ffffff;
  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 229, 255, 0.55);
  }
`;

export const CreatorTypeTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 20px;
`;

export const CreatorTypeDescription = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.45;
`;

export const CreatorButton = styled.button`
  height: 46px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #00e5ff, #00ff99);
  color: #071016;
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
    $error ? "rgba(255, 79, 94, 0.12)" : "rgba(0, 229, 255, 0.1)"};
  border: 1px solid
    ${({ $error }) =>
      $error ? "rgba(255, 79, 94, 0.35)" : "rgba(0, 229, 255, 0.3)"};
  color: ${({ $error }) => ($error ? "#ff8c97" : "#9df6ff")};
  border-radius: 12px;
  padding: 14px;
  font-weight: 700;
`;

export const CreatorExistingBox = styled.div`
  background: #0c0e19;
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 18px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h3 {
    margin: 0;
    font-size: 22px;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.72);
  }

  button {
    margin-top: 10px;
    align-self: flex-start;
  }
`;