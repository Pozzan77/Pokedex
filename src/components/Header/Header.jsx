import "./Header.css"
import logo from "../../assets/Pokédex_logo.png";
import filterLogo from "../../assets/list-filter.png"
import { useNavigate } from "react-router-dom";

function Header(props) {

    const navigate = useNavigate()


    return (
        <header className="header">
            <div className="header-logo">
                <div className="logo">
                    <img src={logo} alt="logo" onClick={() => navigate("/")} />
                </div>
            </div>
            { props.showNav ? (<nav className="nav-bar">
                <div className="search-bar">
                    <img src="src/assets/search.png" alt="" />
                    <input 
                    type="text"
                    placeholder="Search for a pokemon"
                    value={props.search}
                    onChange={(e) => props.setSearch(e.target.value)}
                    />
                </div>
                <div className="end-menu">
                    <button 
                        className="filter-btn"
                        onClick={() => props.setShowFilter(!props.showFilter)}
                    >
                        <img src={filterLogo} alt="" />
                    </button>
                </div>
            </nav>) :  <div className="detail">
                <button className="back-page-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>}
            { props.showFilter && (
            <div>
                <div className="filter-menu">
                    <h2 className="filter-title">Filters</h2>
                        <div className="type-filter">
                            <h3>Type</h3>
                            <ul className="type-list">
                                {props.types.map(type => (
                                    <li className="filter-type">
                                        <button
                                        className={`type ${type} ${type === props.filterType ? "active" : ""}`}
                                        onClick={() => props.setFilterType(type)}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button className="close-filter close-type" onClick={() => props.setFilterType("")}>Remove Filter</button>
                        </div>
                        <div>
                            <div className="generation-filter">
                                <h3>Generation</h3>
                                <div className="generations">
                                    {props.generations.map((generation) => (
                                        <button
                                            key={generation}
                                            onClick={() => props.setFilterGeneration(generation)}
                                            className={`gen ${generation === props.filterGeneration ? "active" : ""}`}
                                        >
                                            {generation}
                                        </button>
                                    ))}
                                </div>
                                <button className="close-filter" onClick={() => props.setFilterGeneration("")}>Remove Filter</button>
                            </div>
                            <div className="variation-filter">
                                <h3>Variations</h3>
                                <div className="variations">
                                    {props.variations.map(variation => (
                                        <button
                                            key={variation}
                                            className={`var ${variation ===props.filterVariation ? "active" : ""}`}
                                            onClick={() => props.setFilterVariation(variation)}
                                        >
                                            {variation.charAt(0).toUpperCase() + variation.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <button className="close-filter" onClick={() => props.setFilterVariation("")}>Remove Filter</button>
                            </div>
                        </div>
                    </div>
                    <div className="filter-back"> 
                        <button onClick={() => props.setShowFilter(false)}>
                            ▲
                        </button>
                    </div>
            </div>
            )}
        </header>
    )
}

export default Header