import "./Pokepage.css"

function Pokepage({pokemon}) {
    

    return (
        <div className="pokepage-container">
            <div className="name">
                <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
            </div>            
            <div className="row">
                <div className="portrait">
                    <img src={pokemon.sprites.other["official-artwork"].front_default} alt={pokemon.name} />
                </div>
                <div className="bio">

                </div>
            </div>
        </div>
    )

}

export default Pokepage