import { useState, useEffect } from "react"
import { getPokemonList } from "./pokemonApi.js"
import "./App.css"
import Header from "./components/Header/Header.jsx"
import PokeCard from "./components/Pokecard/Pokecard.jsx"


function App() {

  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPokemonList() {
      const list = await getPokemonList();

      console.log(list)

      setPokemonList(list);
    }
  
    loadPokemonList();
  }, []);

  const filteredPokemon = pokemonList.filter(pokemon => {
    return pokemon.name.toLowerCase().includes(search.toLowerCase());
  });

  const PokemonElements = filteredPokemon.map(pokemon => {
    return <PokeCard 
      key={pokemon.name}
      pokemon={pokemon}
    />
  })

  return (
    <div className="app">
      <Header 
        search={search}
        setSearch={setSearch}
      />
      <main>
        {PokemonElements}
      </main>
    </div>
  )

};

export default App