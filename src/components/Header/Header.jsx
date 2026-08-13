import "./Header.css"
import logo from "../../assets/Pokédex_logo.png";
import { useNavigate } from "react-router-dom";

function Header(props) {

    const navigate = useNavigate()

    return (
        <header className="header">
            <div className="header-logo">
                <div className="logo">
                    <img src={logo} alt="logo" onClick={() => navigate("/")}/>
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
            </nav>) :  <div className="detail">
                <button className="back-page-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>}
        </header>
    )
}

export default Header