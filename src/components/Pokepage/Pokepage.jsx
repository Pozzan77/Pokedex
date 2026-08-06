import { useState, useEffect } from "react";
import { getPokemonSpecies } from "../../pokemonApi";
import "./Pokepage.css"

function Pokepage({pokemon}) {

    const [species, setSpecies] = useState(null);
    
    useEffect(() => {
        async function loadSpecies() {
            const data = await getPokemonSpecies(pokemon.species.name);
            setSpecies(data);
        }

        loadSpecies();

    }, [pokemon.species.name]);


    if (!species) {
        return null;
    }

    function formatText(text) {
        if (!text) return "";
    
        return text
            .replaceAll("POKéMON", "Pokémon")
            .replaceAll("POKEMON", "Pokémon");
    }

    const description = formatText(
        species.flavor_text_entries
            .find(entry => entry.language.name === "en")
            ?.flavor_text
            .replace(/\n|\f/g, " ")
    );

    return (
        <div className="pokepage-container">
            <div className="detail"></div>
            <div className="name">
                <h1>{pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)}</h1>
            </div>            
            <div className="row">
                <div className="portrait">
                    <img src={pokemon.sprites.other["official-artwork"].front_default} alt={pokemon.species.name} loading="lazy" />
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