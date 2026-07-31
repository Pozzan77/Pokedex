import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PokemonPage from "./pages/PokemonPage.jsx";

function App() {
  return (
    <BrowserRouter>
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