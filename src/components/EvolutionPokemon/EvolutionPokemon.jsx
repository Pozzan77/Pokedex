import "./EvolutionPokemon.css"

function EvolutionPokemon({ evolution }) {
    console.log(evolution);
    return (
        <div className={`evolution ${
            evolution.evolvesTo.length >= 4 ? "many-evolutions" : ""
        }`}>
            <div className="evolution-pokemon">
                <img
                    src={evolution.pokemon.sprites.other["official-artwork"].front_default}
                    alt={evolution.pokemon.name}
                />

                <p>{evolution.pokemon.name.charAt(0).toUpperCase() + evolution.pokemon.name.slice(1)}</p>
            </div>

            {evolution.evolvesTo.length > 0 && (
                <div className="evolution-branches">
                    {evolution.evolvesTo.map((nextEvolution) => (
                        <EvolutionPokemon
                            key={nextEvolution.pokemon.id}
                            evolution={nextEvolution}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default EvolutionPokemon;