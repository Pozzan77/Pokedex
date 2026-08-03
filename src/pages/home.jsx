import { useState, useEffect } from "react";
import { getPokemonList } from "../pokemonApi.js";
import "../App.css";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx"
import PokeCard from "../components/Pokecard/Pokecard.jsx";


function Home() {

  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPokemonList() {
      const list = await getPokemonList();


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
      <Footer />
    </div>
  )

};

export default Home