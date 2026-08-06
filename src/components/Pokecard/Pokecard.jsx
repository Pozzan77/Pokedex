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
    
    return (
        <div className="card" onClick={() => navigate(`/pokemon/${pokemonData.name}`)}>
            <div className="card-img">
                <img src={pokemonData.sprites.front_default} alt={pokemon.species?.name} loading="lazy"/>
            </div>
            <div className="card-name">
                <h3>#{String(pokemonData.id).padStart(3, "0")}</h3>
                <h2>{pokemonData.species.name.charAt(0).toUpperCase() + pokemonData.species.name.slice(1)}</h2>
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