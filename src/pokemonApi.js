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

export async function getPokemonSpecies(name) {
    const response = await fetch(
        `${BASE_URL}/pokemon-species/${name}`
    );

    if (!response.ok) {
        throw new Error("Couldn't load Pokémon species");
    }

    const data = await response.json();

    return data;
}

export async function getPokemonList() {
    const response = await fetch(
      `${BASE_URL}/pokemon?limit=1025`
    );
  
    if (!response.ok) {
      throw new Error("Couldn't load Pokémon list");
    }
  
    const data = await response.json();
  
    return data.results;
  }