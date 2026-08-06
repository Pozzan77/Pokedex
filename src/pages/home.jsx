import { useState, useEffect } from "react";
import { getPokemonList } from "../pokemonApi.js";
import "../App.css";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import PokeCard from "../components/Pokecard/Pokecard.jsx";


function Home() {

  const [pokemonList, setPokemonList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(30);
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

  const PokemonElements = filteredPokemon.slice(0, visibleCount).map((pokemon,index) => {
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

        <button
          className="load-btn"
          onClick={() => setVisibleCount(prev => prev + 30)}
        >
          Load More
        </button>
      </main>
      <Footer />
    </div>
  )

};

export default Home