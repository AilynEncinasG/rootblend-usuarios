import { BrowserRouter } from "react-router-dom";
import { GlobalStyle } from "./styles/GlobalStyles";
import { AppRouter } from "./app/router";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <AppRouter />
    </BrowserRouter>
  );
}