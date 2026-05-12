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
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.74);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #fff;
    background: transparent;
  }
`;

export const Select = styled.select`
  min-height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  color: #fff;
  background: rgba(15, 23, 42, 0.92);
  padding: 0 12px;
`;

export const AuthScreen = styled.main<{ $image: string }>`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.74), rgba(2, 6, 23, 0.94)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`;

export const AuthCard = styled.form`
  width: min(440px, 100%);
  padding: 28px;
  border-radius: 14px;
  background: rgba(7, 12, 27, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
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
    color: #8b5cf6;
  }

  h1 {
    margin: 8px 0 4px;

    span {
      color: #00e5ff;
    }
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.64);
  }
`;

export const Label = styled.label`
  display: block;
  margin: 12px 0 7px;
  color: rgba(226, 232, 240, 0.8);
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
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.76);
  color: #00e5ff;

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #fff;
    background: transparent;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 98px;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  padding: 12px;
  color: #fff;
  background: rgba(15, 23, 42, 0.76);
  outline: 0;
`;

export const FormLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 12px 0;
  color: rgba(226, 232, 240, 0.64);
  font-size: 12px;

  a {
    color: #c084fc;
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
  border: 1px solid ${({ $active }) => ($active ? "#8b5cf6" : "rgba(148, 163, 184, 0.14)")};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(226, 232, 240, 0.76)")};
  background: ${({ $active }) => ($active ? "rgba(124, 58, 237, 0.28)" : "rgba(15, 23, 42, 0.76)")};
  font-weight: 850;
  cursor: pointer;
`;

export const SuccessBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  padding: 11px;
  border-radius: 9px;
  color: #86efac;
  background: rgba(22, 163, 74, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.24);
`;

export const NarrowPanel = styled.div`
  width: min(460px, 100%);
  padding: 18px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);
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
