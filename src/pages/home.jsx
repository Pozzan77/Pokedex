import { useState, useEffect } from "react";
import { getPokemonList, getType} from "../pokemonApi.js";
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
  const [showFilter, setShowFilter] = useState(false)
  const [typePokemon, setTypePokemon] = useState([]);
  const [search, setSearch] = useState(() =>
    sessionStorage.getItem("pokedexSearch") || ""
  );
  const [filterType, setFilterType] = useState(() =>
    sessionStorage.getItem("pokedexFilterType") || ""
  );
  const [filterGeneration, setFilterGeneration] = useState(() =>
    sessionStorage.getItem("pokedexFilterGeneration") || ""
  );
  const [filterVariation, setFilterVariation] = useState(() =>
    sessionStorage.getItem("pokedexFilterVariation") || ""
  );

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

  const variations = [
    "regional",
    "mega",
    "gigantamax"
  ];

  useEffect(() => {
    sessionStorage.setItem("pokedexSearch", search);
  }, [search]);

  useEffect(() => {
    sessionStorage.setItem("pokedexFilterType", filterType);
  }, [filterType]);

  useEffect(() => {
    sessionStorage.setItem("pokedexFilterGeneration", filterGeneration);
  }, [filterGeneration]);

  useEffect(() => {
    sessionStorage.setItem("pokedexFilterVariation", filterVariation);
  }, [filterVariation]);

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
  

  
function getOriginalName(name) {
  return name
    .replace("-mega-x", "")
    .replace("-mega-y", "")
    .replace("-mega-z", "")
    .replace("-mega", "")
    .replace("-gmax", "")
    .replace("-alola-totem", "")
    .replace("-galar-totem", "")
    .replace("-hisui-totem", "")
    .replace("-paldea-totem", "")
    .replace("-alola", "")
    .replace("-galar", "")
    .replace("-hisui", "")
    .replace("-paldea", "")
}

  const filteredPokemon = pokemonList.filter(pokemon => {

    const originalName = getOriginalName(pokemon.name);

    const originalPokemon = pokemonList.find(
      p => p.name === originalName
    );
    
    const id = pokemon.url.split("/").filter(Boolean).pop();

    const originalId = originalPokemon
      ? originalPokemon.url.split("/").filter(Boolean).pop()
      : id;

      if (
        pokemon.name.includes("-totem")
      ) {
        return false;
      }

      if (
        pokemon.name.includes("-low-key")
      ) {
        return false;
      }

    

    if (!filterVariation && Number(id) > 1025) {
      return false;
    }

    if (filterVariation) {

      if (
        filterVariation === "mega" &&
        !pokemon.name.includes("-mega")
      ) {
        return false;
      }
  
      if (
        filterVariation === "gigantamax" &&
        !pokemon.name.includes("-gmax")
      ) {
        return false;
      }
  
      if (
        filterVariation === "regional" &&
        !(
          pokemon.name.endsWith("-alola") ||
          pokemon.name.endsWith("-galar") ||
          pokemon.name.endsWith("-hisui") ||
          pokemon.name.endsWith("-paldea")
        )
      ) {
        return false;
      }
    }

    const seachMatch = pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
    originalId.includes(search)

    const typeMatch =
    !filterType ||
    typePokemon.includes(pokemon.name) ||
    typePokemon.includes(originalName);

    const generationMatch = !filterGeneration ||   (
      Number(originalId) >= generationRanges[filterGeneration][0] &&
      Number(originalId) <= generationRanges[filterGeneration][1]
    );

    return (
      seachMatch && typeMatch && generationMatch
    );
  });

  

  const uniquePokemon = [];

  const seen = new Set();
  
  for (const pokemon of filteredPokemon) {
    const originalName = getOriginalName(pokemon.name);
  
    const originalPokemon = pokemonList.find(
      p => p.name === originalName
    );
  
    const originalId = originalPokemon
      ? originalPokemon.url.split("/").filter(Boolean).pop()
      : pokemon.url.split("/").filter(Boolean).pop();
  
    let uniqueKey = originalId;

    if (pokemon.name.includes("-mega")) {
      uniqueKey = pokemon.name
        .replace("-male-mega", "-mega")
        .replace("-female-mega", "-mega")
        .replace("-original-mega", "-mega")
        .replace("-curly-mega", "-mega")
        .replace("-droopy-mega", "-mega")
        .replace("-stretchy-mega", "-mega")
    }
  
    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
    
      uniquePokemon.push(pokemon);
    }
  }

  uniquePokemon.sort((a, b) => {
    const originalA = pokemonList.find(
      p => p.name === getOriginalName(a.name)
    ) || (
      a.name === "pyroar-mega"
        ? pokemonList.find(p => p.name === "pyroar-male")
        : null
    );
    
    const originalB = pokemonList.find(
      p => p.name === getOriginalName(b.name)
    ) || (
      b.name === "pyroar-mega"
        ? pokemonList.find(p => p.name === "pyroar-male")
        : null
    );
  
    const idA = originalA
      ? Number(originalA.url.split("/").filter(Boolean).pop())
      : Number(a.url.split("/").filter(Boolean).pop());
  
    const idB = originalB
      ? Number(originalB.url.split("/").filter(Boolean).pop())
      : Number(b.url.split("/").filter(Boolean).pop());
  
    return idA - idB;
  });

  const PokemonElements = uniquePokemon
  .slice(0, visibleCount)
  .map((pokemon, index) => {
    
    return (
      <PokeCard
        key={index}
        pokemon={pokemon}
      />
    );
  });



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
        variations={variations}
        filterVariation={filterVariation}
        setFilterVariation={setFilterVariation}
        showNav={true}
      />
      <main>
        {PokemonElements}
        {uniquePokemon.length > visibleCount && (
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