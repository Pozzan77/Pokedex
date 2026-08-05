import { useState, useEffect } from "react";
import { getPokemonSpecies } from "../../pokemonApi";
import "./Pokepage.css"

function Pokepage({pokemon}) {

    const [species, setSpecies] = useState(null);
    
    useEffect(() => {
        async function loadSpecies() {
            const data = await getPokemonSpecies(pokemon.name);
            setSpecies(data);
        }

        loadSpecies();

    }, [pokemon.name]);


    if (!species) {
        return null;
    }

    const description = species.flavor_text_entries
    .find(entry => entry.language.name === "en")
    ?.flavor_text
    .replace(/\n|\f/g, " ");

    return (
        <div className="pokepage-container">
            <div className="detail"></div>
            <div className="name">
                <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
            </div>            
            <div className="row">
                <div className="portrait">
                    <img src={pokemon.sprites.other["official-artwork"].front_default} alt={pokemon.name} />
                </div>
                <div className="bio">
                    <div className="dexN">
                        <h1>National Nº: #{String(pokemon.id).padStart(3, "0")}</h1>
                    </div>
                    <div className="description">
                    <h3>
                        {description}
                    </h3>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Pokepage