import { useState, useEffect } from "react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { getPokemon } from "../../pokemonApi";
import "./Pokecard.css"


function PokeCard({pokemon}) {


    const [pokemonData,setPokemonData] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        async function loadPokemonCard() {
            const data = await getPokemon(pokemon.name)
            setPokemonData(data)
        }
        loadPokemonCard()

    }, [pokemon.name])

    if (!pokemonData) {
        return <div className="card loading">Loading...</div>
    }

    function formatPokemonName(name) {
        if (!name) return "";
    
        return name
            .replace("-female-mega", "-mega")
            .replace("-male-mega", "-mega")
            .replace("-curly-mega", "-mega")
            .replace("-amped-gmax", "-gmax")
            .replaceAll("-", " ")
            .replace(/\bgmax\b/i, "Gigantamax")
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    const speciesId = pokemonData.species.url
    .split("/")
    .filter(Boolean)
    .pop();

    function getDisplayName(pokemonData) {
        const name = pokemonData.name;
    
        if (
            name.includes("-mega") ||
            name.includes("-gmax") ||
            name.endsWith("-alola") ||
            name.endsWith("-galar") ||
            name.endsWith("-hisui") ||
            name.endsWith("-paldea")
        ) {
            return formatPokemonName(name);
        }
    
        return formatPokemonName(pokemonData.species.name);
    }
    
    return (
        <div className="card" onClick={() => navigate(`/pokemon/${pokemonData.name}`)}>
            <div className="card-img">
            <img
                src={
                    pokemonData.sprites.front_default ||
                    pokemonData.sprites.other.home.front_default
                }
                alt={pokemon.species?.name}
                loading="lazy"
            />
            </div>
            <div className="card-name">
                <h3>#{String(speciesId).padStart(3, "0")}</h3>
                <h2>{getDisplayName(pokemonData)}</h2>
            </div>
            <div className={"card-types"}>
                {pokemonData.types.map(({ type }) => (
                    <span key={type.name} className={`type ${type.name}`}>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                ))}
            </div>
        </div>
    )
}

export default memo(PokeCard)