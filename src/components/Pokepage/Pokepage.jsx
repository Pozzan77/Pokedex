import "./Pokepage.css"

function Pokepage({pokemon}) {
    

    return (
        <div className="pokepage-container">
            <div className="portrait">
                <img src={pokemon.sprites.other["official-artwork"].front_default} alt={pokemon.name} />
            </div>
        </div>
    )

}

export default Pokepage