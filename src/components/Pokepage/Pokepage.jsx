import { useState, useEffect } from "react";
import { getPokemon, getPokemonSpecies, getAbility, getType, getEvolutionChain } from "../../pokemonApi";
import { cropPokemonImage } from "../../utils/cropPokemonImage";
import EvolutionPokemon from "../EvolutionPokemon/EvolutionPokemon.jsx"
import "./Pokepage.css"
import maleIcon from "../../assets/male.png";
import femaleIcon from "../../assets/female.png";
import shinyIcon from "../../assets/shiny.png";


function Pokepage({pokemon}) {

    const [species, setSpecies] = useState(null);
    const [typeData, setTypeData] = useState([])
    const [ability, setAbility] = useState(null);
    const [isAbility,setIsAbility] = useState(false);
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [evolutions, setEvolutions] = useState(null)
    const [isShiny, setIsShiny] = useState(false);
    const [displayImage, setDisplayImage] = useState(null);

    
    const normalAbility = pokemon.abilities.find(
        ({ is_hidden }) => !is_hidden
    );
    
    
    useEffect(() => {
        async function loadSpecies() {
            const data = await getPokemonSpecies(pokemon.species.name);
            setSpecies(data);
        }

        loadSpecies();

    }, [pokemon.species.name]);

    useEffect(() => {
        async function loadAbility() {
            const data = await getAbility(normalAbility.ability.name);
            setAbility(data);
        }
    
        if (normalAbility) {
            loadAbility();
        }
    }, [normalAbility]);

    useEffect(() => {
        async function loadTypes() {
            const types = await Promise.all(
                pokemon.types.map(({ type }) => getType(type.name))
            );
    
            setTypeData(types);
        }
    
        loadTypes();
    }, [pokemon.types]);

    async function getEvolutionData(chain) {
        const species = await getPokemonSpecies(chain.species.name);
    
        const defaultVariety = species.varieties.find(
            variety => variety.is_default
        );
    
        const pokemon = await getPokemon(
            defaultVariety.pokemon.name
        );
    
        const nextEvolutions = await Promise.all(
            chain.evolves_to.map(evolution =>
                getEvolutionData(evolution)
            )
        );
    
        return {
            pokemon,
            speciesName: chain.species.name,
            evolvesTo: nextEvolutions,
            evolutionDetails: chain.evolution_details
        };
    }

    useEffect(() => {
        async function loadEvolutionChain() {
            const species = await getPokemonSpecies(pokemon.species.name);
    
            const url = species.evolution_chain.url;
    
    
            const evolutionId = url
                .split("/")
                .filter(Boolean)
                .pop();
    
    
            const evolution = await getEvolutionChain(evolutionId);
    
            setEvolutionChain(evolution);
        }
    
        loadEvolutionChain();
    }, [pokemon.species.name]);

    useEffect(() => {
        async function loadEvolutions() {
            if (!evolutionChain) return;
    
            const data = await getEvolutionData(
                evolutionChain.chain
            );
    
            setEvolutions(data);
        }
    
        loadEvolutions();
    }, [evolutionChain]);

    useEffect(() => {
        const image = isShiny
            ? pokemon.sprites.other["official-artwork"].front_shiny
            : pokemon.sprites.other["official-artwork"].front_default;
    
        cropPokemonImage(image)
            .then(setDisplayImage)
            .catch(console.error);
    }, [pokemon, isShiny]);
    


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

    
    const abilityName = normalAbility
        ? normalAbility.ability.name
            .replace("-", " ")
            .replace(/\b\w/g, letter => letter.toUpperCase())
        : "";

    const abilityDescription = ability?.effect_entries.find(
        ({ language }) => language.name === "en"
    )?.short_effect;
    
    const genderRate = species.gender_rate;

    const malePercentage = genderRate === -1
        ? 0
        : 100 - (genderRate * 12.5);

    const femalePercentage = genderRate === -1
        ? 0
        : genderRate * 12.5;

    const totalStats = pokemon.stats.reduce(
        (total, stat) => total + stat.base_stat,
        0
    );

    function calculateTypeEffectiveness(types) {
        const effectiveness = {};
    
        types.forEach((type) => {
            type.damage_relations.double_damage_from.forEach(({ name }) => {
                effectiveness[name] = (effectiveness[name] || 1) * 2;
            });
    
            type.damage_relations.half_damage_from.forEach(({ name }) => {
                effectiveness[name] = (effectiveness[name] || 1) * 0.5;
            });
    
            type.damage_relations.no_damage_from.forEach(({ name }) => {
                effectiveness[name] = 0;
            });
        });
    
        return effectiveness;
    }
    
    const effectiveness = calculateTypeEffectiveness(typeData);

    return (
        <div className="pokepage-container">
            <div className="name">
                <h1>{pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)}</h1>
            </div>            
            <div className="row">
                <div className="left-part">
                    <div className="portrait">
                    {displayImage && (
                        <img
                            src={displayImage}
                            alt={pokemon.species.name}
                        />
                    )}
                    </div>
                    <div className="shiny">
                        <button className="shiny-btn" onClick={() => setIsShiny(!isShiny)}>
                            <img src={shinyIcon} alt="" />
                            <span>Shiny</span>
                        </button>
                    </div>
                </div>
                <div className={`bio ${isAbility ? "ability-desc" : ""}`}>
                {!isAbility ? (
                    <>
                        <div className="dexN">
                            <h1>
                                National Nº: #{String(pokemon.id).padStart(3, "0")}
                            </h1>
                        </div>

                        <div className="description">
                            <h3>{description}</h3>
                        </div>

                        <div className="row-type-species">
                            <div className="types">
                                <h3>Types:</h3>

                                <div className="page-type">
                                    {pokemon.types.map(({ type }) => (
                                        <span 
                                            key={type.name} 
                                            className={`type ${type.name}`}
                                        >
                                            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                                        </span>
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

                        <div className="ability-gender-row">
                            <div className="ability">
                                <h3>Ability:</h3>
                                <div className="ability-name">
                                <span>{abilityName}</span>

                                <button 
                                    className="ability-effect-btn"
                                    onClick={() => setIsAbility(true)}
                                >
                                    ?
                                </button>
                                </div>
                            </div>
                            <div className="gender">
                                <h3>Gender:</h3>
                                <div className="gender-info">
                                    <div className="male">
                                        <img src={maleIcon} alt="" />
                                        <span>{malePercentage}%</span>
                                    </div>
                                    <div className="female">
                                        <img src={femaleIcon} alt="" />
                                        <span>{femalePercentage}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <button 
                            className="ability-effect-btn back"
                            onClick={() => setIsAbility(false)}
                        >
                            Back
                        </button>
                        <div>
                            <h2 className="ability-title">{abilityName}</h2>
                        </div>

                        <div className="ability-text">
                            <p>{abilityDescription}</p>
                        </div>

                    </>
                )}
            </div>               
            </div>

            <div className="base-stats">
                <h2>Base Stats:</h2>
                    {pokemon.stats.map((stat) => (
                        <div className="stat" key={stat.stat.name}>
                                <span className="stat-name">
                                    {stat.stat.name
                                        .replace("special-attack", "Sp. Attack")
                                        .replace("special-defense", "Sp. Defense")
                                        .replace("attack", "Attack")
                                        .replace("defense", "Defense")
                                        .replace("speed", "Speed")
                                        .replace("hp", "HP")
                                    }
                                </span>
                                <span className="stat-value">{stat.base_stat}</span>
                            
                            <div className="stat-bar">
                                <div
                                className="stat-bar-fill"
                                style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}

                    <div className="stat total-stat">
                        <span className="stat-name">Total</span>
                        <span className="stat-value">{totalStats}</span>

                        <div className="stat-bar">
                            <div
                                className="stat-bar-fill"
                                style={{
                                    width: `${(totalStats / 720) * 100}%`
                                }}
                            ></div>
                        </div>
                    </div>
            </div>
            <div>
                <div className="effectiveness">
                    <h2>Weaknesses :</h2>

                    <div className="effectiveness-types">
                        {Object.entries(effectiveness)
                            .filter(([, multiplier]) => multiplier > 1)
                            .map(([type, multiplier]) => (
                                <div key={type} className="effectiveness-type">

                                    <span className="multiplier-type">{multiplier}x</span>

                                    <span className={`type ${type}`}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </span>

                                </div>
                            ))}
                    </div>
                    <div className="effectiveness">
                        <h2>Resistances:</h2>

                        <div className="effectiveness-types">
                            {Object.entries(effectiveness)
                                .filter(([, multiplier]) => multiplier < 1 && multiplier > 0)
                                .map(([type, multiplier]) => (
                                    <div key={type} className="effectiveness-type">
                                        <span className="multiplier-type">{multiplier}×</span>

                                        <span className={`type ${type}`}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                    {Object.entries(effectiveness).some(
                        ([, multiplier]) => multiplier === 0
                    ) && (
                        <div className="effectiveness">
                            <h2>Immunities:</h2>

                            <div className="effectiveness-types">
                                {Object.entries(effectiveness)
                                    .filter(([, multiplier]) => multiplier === 0)
                                    .map(([type]) => (
                                        <div key={type} className="effectiveness-type">
                                            <span className="multiplier-type"></span>
                                            <span className={`type ${type}`}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}              
                </div>
                <div className="evolution-container">
                    <h2>Evolutions</h2>
                    {evolutions && (
                        <EvolutionPokemon evolution={evolutions} />
                    )}
                </div>
                
                </div>
        </div>
    )

}

export default Pokepage