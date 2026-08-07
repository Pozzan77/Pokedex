import "./Header.css"

function Header(props) {
    return (
        <header className="header">
            <div className="header-logo">
                
            </div>
            { props.showNav && (<nav className="nav-bar">
                <div className="search-bar">
                    <img src="src/assets/search.png" alt="" />
                    <input 
                    type="text"
                    placeholder="Search for a pokemon"
                    value={props.search}
                    onChange={(e) => props.setSearch(e.target.value)}
                    />
                </div>
            </nav>)}
        </header>
    )
}

export default Header