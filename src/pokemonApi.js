const BASE_URL = "https://pokeapi.co/api/v2"

export async function getPokemon(name) {
    const response = await fetch(
        `${BASE_URL}/pokemon/${name}`
    )

    if (!response.ok) {
        throw new Error ("pokemon not found")
    }

    const data = await response.json();

    return data;
    
}

export async function getPokemonList() {
    const response = await fetch(
      `${BASE_URL}/pokemon?limit=151`
    );
  
    if (!response.ok) {
      throw new Error("Couldn't load Pokémon list");
    }
  
    const data = await response.json();
  
    return data.results;
  }