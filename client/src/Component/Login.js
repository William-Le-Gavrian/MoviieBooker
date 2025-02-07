import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            email: email,
            password: password,
        };

        try {
            const response = await axios.post("http://localhost:3001/auth/login", user);

            if (response.status === 200) {
                localStorage.setItem("access_token", response.data.access_token);
                navigate("/");
            }
        } catch (e) {
            setError(e.response ? e.response.data.message : "Erreur inconnue");
        }
    };

    return (
        <div className="authentication">
            <h2>Connexion</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="email-input-container">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@mail.com"
                        required
                    />
                </div>
                <div className="password-input-container">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="test1234"
                        required
                    />
                </div>
                <button type="submit">Sign in</button>
            </form>
        </div>
    );
};

export default Login;
