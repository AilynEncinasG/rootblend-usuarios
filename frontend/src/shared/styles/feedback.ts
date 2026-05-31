//frontend/src/shared/styles/feedback.ts
import styled from "styled-components";

export const AlertPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  padding: 14px;
  border-radius: 12px;
  color: var(--rb-warning);
  background: color-mix(in srgb, var(--rb-warning) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-warning) 26%, transparent);

  p {
    margin: 4px 0 0;
    color: var(--rb-muted);
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
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--rb-muted-soft) 8%, transparent),
      color-mix(in srgb, var(--rb-muted-soft) 18%, transparent),
      color-mix(in srgb, var(--rb-muted-soft) 8%, transparent)
    );
  background-size: 200% 100%;
  border: 1px solid var(--rb-border);
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
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  color: var(--rb-text);
  box-shadow: 0 16px 42px color-mix(in srgb, var(--rb-shadow) 42%, transparent);

  h1,
  h2 {
    margin: 12px 0 8px;
    color: var(--rb-text-strong);
  }

  p {
    color: var(--rb-muted);
  }
`;

export const StateIcon = styled.div`
  width: 96px;
  height: 96px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  color: var(--rb-accent);
  background: color-mix(in srgb, var(--rb-accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-accent) 20%, transparent);

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
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  color: var(--rb-text);
  box-shadow: 0 16px 42px color-mix(in srgb, var(--rb-shadow) 42%, transparent);

  h1,
  h2,
  h3 {
    color: var(--rb-text-strong);
  }

  p {
    color: var(--rb-muted);
  }
`;

export const DangerIcon = styled.div`
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--rb-danger);
  background: color-mix(in srgb, var(--rb-danger) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-danger) 28%, transparent);

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
  border-bottom: 1px solid var(--rb-border);
  color: var(--rb-text);

  small {
    color: var(--rb-muted-soft);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: var(--rb-text);

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid var(--rb-border);
    text-align: left;
  }

  th {
    color: var(--rb-muted-soft);
    font-size: 11px;
    text-transform: uppercase;
  }

  td {
    color: var(--rb-text);
  }
`;
