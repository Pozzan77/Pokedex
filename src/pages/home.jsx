import { useState, useEffect } from "react";
import { getPokemonList } from "../pokemonApi.js";
import "../App.css";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import PokeCard from "../components/Pokecard/Pokecard.jsx";


function Home() {

  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPokemonList() {
      const list = await getPokemonList();
  
      const uniqueList = list.filter(
        (pokemon, index, self) =>
          index === self.findIndex(
            p => p.name === pokemon.name
          )
      );
  
      setPokemonList(uniqueList);
    }
  
    loadPokemonList();
  }, []);

  const filteredPokemon = pokemonList.filter(pokemon => {
    return pokemon.name.toLowerCase().includes(search.toLowerCase());
  });

  const PokemonElements = filteredPokemon.map((pokemon,index) => {
    return <PokeCard 
      key={index}
      pokemon={pokemon}
    />
  })


  return (
    <div className="app">
      <Header 
        search={search}
        setSearch={setSearch}
        showNav={true}
      />
      <main>
        {PokemonElements}
      </main>
      <Footer />
    </div>
  )

};

export default Home