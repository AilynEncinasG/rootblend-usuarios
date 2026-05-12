const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const layoutDir = path.join(projectRoot, "src", "shared", "layout");

fs.mkdirSync(layoutDir, { recursive: true });

const files = {
  "RootShell.tsx": `/*
  Bridge temporal de layout.

  IMPORTANTE:
  Este archivo permite que las nuevas páginas importen RootShell desde shared/layout,
  pero todavía conserva el RootShell original dentro de RootblendScreens.legacy.tsx.

  No cambiar aquí todavía. La extracción real se hará cuando ya hayamos migrado
  Home/Auth/Streams y podamos comparar visualmente sin romper estilos.
*/

export { RootShell } from "../../modules/mock/RootblendScreens.legacy";
`,

  "pageLinks.ts": `/*
  Bridge temporal de navegación.

  Por ahora pageLinks sigue viviendo dentro de RootblendScreens.legacy.tsx.
  Este archivo queda reservado para la extracción real posterior.
*/

export type PageLink = {
  label: string;
  to: string;
  key: string;
};
`,

  "DemoRightPanel.tsx": `/*
  Bridge temporal.

  DemoRightPanel original todavía vive dentro de RootblendScreens.legacy.tsx
  y se usa internamente desde RootShell/Home. Lo extraeremos más adelante
  cuando migremos HomePage con comparación visual.
*/

export function DemoRightPanelPlaceholder() {
  return null;
}
`,

  "index.ts": `export * from "./RootShell";
export * from "./pageLinks";
export * from "./DemoRightPanel";
`,
};

for (const [fileName, content] of Object.entries(files)) {
  const filePath = path.join(layoutDir, fileName);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`[OK] ${path.relative(projectRoot, filePath)}`);
}

console.log("[DONE] Layout bridges creados sin tocar el legacy.");