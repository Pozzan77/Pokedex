import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Pokepage from "../components/Pokepage/Pokepage.jsx"
import "./PokemonPage.css"
import { useLocation } from "react-router-dom";

function PokemonPage() {

    const location = useLocation();
    const pokemon = location.state;

    return (
        <div className="page"> 
           <Header  />
           <main>
                <Pokepage pokemon={pokemon}/>
            </main>
            <Footer /> 
        </div>
    )
}

export default PokemonPage