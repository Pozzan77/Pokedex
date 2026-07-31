import { useState, useEffect } from "react";
import { getPokemon } from "../../pokemonApi";
import "./Pokecard.css"


function PokeCard({pokemon}) {

    const [pokemonData,setPokemonData] = useState(null)

    useEffect(() => {
        async function loadPokemonCard() {
            const data = await getPokemon(pokemon.name)
            setPokemonData(data)
        }
        loadPokemonCard()

    }, [pokemon.name])

    if (!pokemonData) {
        return null
    }

    
    return (
        <div className="card">
            <div className="card-img">
                <img src={pokemonData.sprites.front_default} alt={pokemon.name} />
            </div>
            <div className="card-name">
                <h3>#{String(pokemonData.id).padStart(3, "0")}</h3>
                <h2>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
            </div>
            <div className={"card-types"}>
                {pokemonData.types.map(({ type }) => (
                    <span key={type.name} className={`type ${type.name}`}>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                ))}
            </div>
        </div>
    )
}

export default PokeCard