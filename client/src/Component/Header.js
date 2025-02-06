import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import '../styles/header.css'

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("access_token");

            try {
                const response = await axios.get("http://localhost:3001/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
            }
        };
        fetchUser();
    }, [])

    console.log(user);

    return (
        <header>
            <nav>
                <ul className="menu">
                    <li className="btn-menu"><Link to="/">Home</Link></li>
                    <li className="btn-menu"><Link to="/login">Sign in</Link></li>
                    <li className="btn-menu"><Link to="/register">Sign up</Link></li>
                    {user ? (
                        <div>
                            <span>Bienvenue, {user.email} !</span>
                            <button onClick={() => {
                                localStorage.removeItem("access_token");
                                setUser(null);
                            }}>
                                Déconnexion
                            </button>
                        </div>
                    ) : null}
                </ul>
            </nav>
        </header>
    );
}

export default Header;