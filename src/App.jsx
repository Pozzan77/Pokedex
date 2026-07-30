import { useState, useEffect } from "react"
import { getPokemonList, getPokemonSearch } from "./pokemonApi.js"
import "./App.css"
import Header from "./components/Header/Header.jsx"


function App() {

  const [pokemonList, setPokemonList] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function loadPokemonList() {
      const list = await getPokemonList();
      setPokemonList(list);
    }
  
    loadPokemonList();
  }, []);

  useEffect(() => {
    if (pokemonSearch === "") return;

    async function SearchPokemon(params) {
      
    }
    }
  }, [search])


  return (
    <div className="app">
      <Header 
        search={search}
        setSearch={setSearch}
      />
      <main>

      </main>
    </div>
  )

}

export default App