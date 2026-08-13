import { useState, useEffect } from "react";
import { getPokemon, getPokemonSpecies, getAbility, getType, getEvolutionChain } from "../../pokemonApi";
import { useNavigate } from "react-router-dom";
import { cropPokemonImage } from "../../utils/cropPokemonImage";
import { getRegionalEvolutionMethod } from "../../utils/RegionalEvolution.js";
import EvolutionPokemon from "../EvolutionPokemon/EvolutionPokemon.jsx"
import "./Pokepage.css"
import maleIcon from "../../assets/male.png";
import femaleIcon from "../../assets/female.png";
import shinyIcon from "../../assets/shiny.png";


function Pokepage({pokemon}) {

    const navigate = useNavigate()


    const [species, setSpecies] = useState(null);
    const [typeData, setTypeData] = useState([])
    const [ability, setAbility] = useState(null);
    const [isAbility,setIsAbility] = useState(false);
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [evolutions, setEvolutions] = useState(null)
    const [isShiny, setIsShiny] = useState(false);
    const [displayImage, setDisplayImage] = useState(null);
    const [isVariationOpen, setIsVariationOpen] = useState(false);

    
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

    function getRegionalForm(pokemonName) {
        const regionalForms = [
            "alola",
            "galar",
            "hisui",
            "paldea"
        ];
    
        for (const form of regionalForms) {
            if (pokemonName.endsWith(`-${form}`)) {
                return form;
            }
        }
    
        return null;
    }

    async function getEvolutionData(chain, regionalForm = null) {
        const species = await getPokemonSpecies(chain.species.name);
    
        let selectedVariety = species.varieties.find(
            variety => variety.is_default
        );
    
        if (regionalForm) {
            const regionalVariety = species.varieties.find(
                variety =>
                    variationHasRegionalForm(
                        variety.pokemon.name,
                        regionalForm
                    )
            );
    
            if (regionalVariety) {
                selectedVariety = regionalVariety;
            }
        }
    
        const pokemon = await getPokemon(
            selectedVariety.pokemon.name
        );
    
        const nextEvolutions = await Promise.all(
            chain.evolves_to.map(async (evolution) => {
    
                const evolutionData = await getEvolutionData(
                    evolution,
                    regionalForm
                );
    
                const regionalMethod = getRegionalEvolutionMethod(
                    evolutionData.pokemon.name
                );

                
                if (regionalMethod) {
                    evolutionData.evolutionDetails = [regionalMethod];
                }
    
                return evolutionData;
            })
        );
    
        return {
            pokemon,
            speciesName: chain.species.name,
            evolvesTo: nextEvolutions,
            evolutionDetails: chain.evolution_details
        };
    }

    function variationHasRegionalForm(name, regionalForm) {
        return name.endsWith(`-${regionalForm}`);
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


            const regionalForm = getRegionalForm(pokemon.name);
    
            const data = await getEvolutionData(
                evolutionChain.chain,
                regionalForm
            );
    
            setEvolutions(data);
        }
    
        loadEvolutions();
    }, [evolutionChain, pokemon.name]);

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
            .replaceAll("POKEMON", "Pokémon")
            .replace(/\b[A-Z]{3,}[a-z]*\b/g, word =>
                word.charAt(0) + word.slice(1).toLowerCase()
            );
    }

    const description = formatText(
        species.flavor_text_entries
            .find(entry => entry.language.name === "en")
            ?.flavor_text
            .replace(/\n|\f/g, " ")
    );

    function formatPokemonName(name) {
        if (!name) return "";
    
        const specialNames = {
            "farfetchd": "Farfetch'd",
            "farfetchd-galar": "Farfetch'd Galar",
            "sirfetchd": "Sirfetch'd",
            "mr-mime": "Mr. Mime",
            "mr-rime": "Mr. Rime",
            "mime-jr": "Mime Jr.",
            "nidoran-f": "Nidoran♀",
            "nidoran-m": "Nidoran♂",
        };
    
        if (specialNames[name]) {
            return specialNames[name];
        }
    
        const parts = name.split("-");
    
        // Mega
        if (parts[1] === "mega") {
            const baseName = parts[0];
            const variant = parts.slice(2).join(" ");
    
            return `Mega ${capitalize(baseName)}${
                variant ? ` ${capitalize(variant)}` : ""
            }`;
        }
    
        // Gigantamax
        if (parts[1] === "gmax") {
            return `Gigantamax ${capitalize(parts[0])}`;
        }
    
        return parts.map(capitalize).join(" ");
    }
    
    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

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

    const excludedVariations = [
        "pikachu-original-cap",
        "pikachu-hoenn-cap",
        "pikachu-sinnoh-cap",
        "pikachu-unova-cap",
        "pikachu-kalos-cap",
        "pikachu-alola-cap",
        "pikachu-partner-cap",
        "pikachu-starter",
        "pikachu-world-cap"
    ];

    
    
    const effectiveness = calculateTypeEffectiveness(typeData);

    return (
        <div className="pokepage-container">
            <div className="name">
                <h1>{formatPokemonName(pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1))}</h1>
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
                    <div className={`variation-select ${isVariationOpen ? "open" : ""}`}>
                        <button 
                            className="variation-btn"
                            onClick={() => setIsVariationOpen(!isVariationOpen)}>     

                            <span>
                                {formatPokemonName(pokemon.name)}
                            </span>
                            
                            <span className="arrow">
                                {isVariationOpen ? "▲" : "▼"}
                            </span>                       
                        </button>

                        {isVariationOpen && (
                            <div className="variations-options">
                                {species.varieties.filter( variation => !excludedVariations.includes(variation.pokemon.name))                                
                                .map((variation) => (
                                    <div className="options" key={species.variation} onClick={() => {
                                        navigate(`/pokemon/${variation.pokemon.name}`);
                                        setIsVariationOpen(false);
                                    }}>
                                        {formatPokemonName(variation.pokemon.name)}
                                    </div>
                                ))}
                            </div>
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
                                National Nº: #{String(species.id).padStart(3, "0")}
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