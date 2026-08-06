import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollRestoration from "./ScrollRestoration.jsx";
import Home from "./pages/Home.jsx";
import PokemonPage from "./pages/PokemonPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollRestoration />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:name" element={<PokemonPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;