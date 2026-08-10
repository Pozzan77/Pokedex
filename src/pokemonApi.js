const BASE_URL = "https://pokeapi.co/api/v2"

const pokemonCache = {};


export async function getPokemon(name) {

    if (pokemonCache[name]) {
        return pokemonCache[name];
    }

    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`
    );

    const data = await response.json();

    pokemonCache[name] = data;

    return data;
}

const speciesCache = {};

export async function getPokemonSpecies(name) {

    if (speciesCache[name]) {
        return speciesCache[name];
    }

    const response = await fetch(
        `${BASE_URL}/pokemon-species/${name}`
    );

    const data = await response.json();

    speciesCache[name] = data;

    return data;
}

const abilityCache = {};

export async function getAbility(name) {
    if (abilityCache[name]) {
        return abilityCache[name];
    }

    const response = await fetch(
        `${BASE_URL}/ability/${name}`
    );

    if (!response.ok) {
        throw new Error("Couldn't load ability");
    }

    const data = await response.json();

    abilityCache[name] = data;

    return data;
}

const typeCache = {};

export async function getType(name) {
    if (typeCache[name]) {
        return typeCache[name];
    }

    const response = await fetch(
        `${BASE_URL}/type/${name}`
    );

    if (!response.ok) {
        throw new Error("Couldn't load type");
    }

    const data = await response.json();

    typeCache[name] = data;

    return data;
}

let pokemonListCache = null;

export async function getPokemonList() {

    if (pokemonListCache) {
        return pokemonListCache;
    }

    const response = await fetch(
        `${BASE_URL}/pokemon?limit=1025`
    );

    if (!response.ok) {
        throw new Error("Couldn't load Pokémon list");
    }

    const data = await response.json();

    pokemonListCache = data.results;

    return pokemonListCache;
}