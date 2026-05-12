import styled from "styled-components";

export const AlertPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  padding: 14px;
  border-radius: 12px;
  color: #fde68a;
  background: rgba(202, 138, 4, 0.12);
  border: 1px solid rgba(202, 138, 4, 0.26);

  p {
    margin: 4px 0 0;
    color: rgba(226, 232, 240, 0.7);
  }
`;

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
`;

export const SkeletonCard = styled.div`
  height: 190px;
  border-radius: 12px;
  background:
    linear-gradient(90deg, rgba(148, 163, 184, 0.08), rgba(148, 163, 184, 0.18), rgba(148, 163, 184, 0.08));
  background-size: 200% 100%;
  border: 1px solid rgba(148, 163, 184, 0.1);
  animation: shimmer 1.5s infinite linear;

  @keyframes shimmer {
    from { background-position: 0 0; }
    to { background-position: -200% 0; }
  }
`;

export const StatePanel = styled.div`
  width: min(620px, 100%);
  margin: 60px auto;
  text-align: center;
  padding: 34px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);

  h1,
  h2 {
    margin: 12px 0 8px;
  }

  p {
    color: rgba(226, 232, 240, 0.68);
  }
`;

export const StateIcon = styled.div`
  width: 96px;
  height: 96px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  color: #00e5ff;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.2);

  svg {
    width: 44px;
    height: 44px;
  }

  strong {
    font-size: 36px;
  }
`;

export const DialogCard = styled.div`
  width: min(480px, 100%);
  margin: 30px auto;
  text-align: center;
  padding: 24px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.14);

  p {
    color: rgba(226, 232, 240, 0.68);
  }
`;

export const DangerIcon = styled.div`
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fecdd3;
  background: rgba(220, 38, 38, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.28);

  svg {
    width: 36px;
    height: 36px;
  }
`;

export const ServiceRow = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.7fr 0.8fr 0.5fr 0.8fr;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  small {
    color: rgba(226, 232, 240, 0.62);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    text-align: left;
  }

  th {
    color: rgba(226, 232, 240, 0.62);
    font-size: 11px;
    text-transform: uppercase;
  }
`;
