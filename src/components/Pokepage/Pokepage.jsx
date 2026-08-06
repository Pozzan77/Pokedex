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

    const genus = species.genera.find(
        entry => entry.language.name === "en"
    )?.genus;

    const height = (pokemon.height / 10).toFixed(1);
    const weight = (pokemon.weight / 10).toFixed(1);

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
                    <div className="row-type-species">
                        <div className="types">
                            <h3>
                                Types:
                            </h3>
                            <div className="page-type">
                                {pokemon.types.map(({ type }) => (
                                <span key={type.name} className={`type ${type.name}`}>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                                ))}
                            </div>
                        </div>
                        <div className="species">
                            <h3>Species:</h3>
                            <span>{genus}</span>
                        </div>
                    </div>
                    <div className="proportions-row">
                        <div className="height">
                            <h3>Height:</h3>
                            <span>{height} M</span>
                        </div>
                        <div className="weight">
                            <h3>Weight:</h3>
                            <span>{weight} Kg</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Pokepage