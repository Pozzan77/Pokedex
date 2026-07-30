import { useState, useEffect } from "react";
import { getPokemon } from "../../pokemonApi";
import "./pokecard.css"


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
            <h3>{pokemon.name}</h3>
        </div>
    )
}

export default PokeCard