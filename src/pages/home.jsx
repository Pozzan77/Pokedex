import { useState, useEffect } from "react";
import { getPokemonList, getType } from "../pokemonApi.js";
import "../App.css";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import PokeCard from "../components/Pokecard/Pokecard.jsx";


function Home() {

  const [pokemonList, setPokemonList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(() => {
    const saved = sessionStorage.getItem("visibleCount");
    return saved ? Number(saved) : 30;
  });
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false)
  const [filterType, setFilterType] = useState("")
  const [typePokemon, setTypePokemon] = useState([]);
  const [filterGeneration, setFilterGeneration] = useState("")

  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy"
  ];

  useEffect(() => {

    async function loadPokemonList() {
        const list = await getPokemonList();

        setPokemonList(list);
    }

    loadPokemonList();

}, []);

  useEffect(() => {
    sessionStorage.setItem(
      "visibleCount",
      visibleCount
    );
  }, [visibleCount]);

  useEffect(() => {
    async function loadType() {
      if (!filterType) {
        setTypePokemon([]);
        return;
      }
  
      const data = await getType(filterType);
  
      setTypePokemon(data.pokemon.map(pokemon => pokemon.pokemon.name));
    }
  
    loadType();
  }, [filterType]);

  const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  const generationRanges = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1025]
  };

  const filteredPokemon = pokemonList.filter(pokemon => {

    const id = pokemon.url.split("/").filter(Boolean).pop();

    const seachMatch = pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
    id.includes(search)

    const typeMatch = !filterType || typePokemon.includes(pokemon.name)

    const generationMatch = !filterGeneration ||   (
      Number(id) >= generationRanges[filterGeneration][0] &&
      Number(id) <= generationRanges[filterGeneration][1]
    );

    return (
      Number(id) <= 1025 && seachMatch && typeMatch && generationMatch
    );
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
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        types={types}
        filterType={filterType}
        setFilterType={setFilterType}
        generations={generations}
        filterGeneration={filterGeneration}
        setFilterGeneration={setFilterGeneration}
        showNav={true}
      />
      <main>
        {PokemonElements}
        {filteredPokemon.length > visibleCount && (
          <button
            className="load-btn"
            onClick={() => setVisibleCount(prev => prev + 30)}
          >
            Load More
          </button>
        )}
      </main>
      <Footer />
    </div>
  )

};

export default Home