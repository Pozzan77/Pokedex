import "./EvolutionPokemon.css"
import { useNavigate } from "react-router-dom";
import { getEvolutionMethod } from "../../utils/EvolutionMethod";

function EvolutionPokemon({ evolution }) {
    
    const navigate = useNavigate()

    const evolutionDetails = evolution.evolutionDetails?.[0];

    const evolutionMethod = getEvolutionMethod(evolutionDetails);

    return (
            <div className={`evolution ${
                evolution.evolvesTo.length >= 4 ? "many-evolutions" : ""
            }`}>


            {evolutionMethod &&  (
                <span className="evolution-method">{evolutionMethod}</span>
            )}




            <div className="evolution-pokemon">
                <img
                    src={evolution.pokemon.sprites.other["official-artwork"].front_default}
                    alt={evolution.pokemon.name}
                    onClick={() => {
                        navigate(`/pokemon/${evolution.pokemon.name}`);
                        window.scrollTo({top: 0, behavior: "smooth"});
                    }}
                />


                <p>
                    {evolution.speciesName.charAt(0).toUpperCase() +
                    evolution.speciesName.slice(1)}
                </p>
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

