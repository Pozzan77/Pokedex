import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Pokepage from "../components/Pokepage/Pokepage.jsx";
import "./PokemonPage.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPokemon } from "../pokemonApi.js";


function PokemonPage() {

    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        async function loadPokemon() {
            const data = await getPokemon(name);
            setPokemon(data);
        }

        loadPokemon();
    }, [name]);

    if (!pokemon) {
        return null;
    }

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