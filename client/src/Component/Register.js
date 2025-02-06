import {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Register = () => {
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

        try{
            const response = await axios.post("http://localhost:3001/auth/register", user);

            if(response.status === 201){
                navigate("/login");
            }
        } catch (e){
            setError(e.response ? e.response.data.error : e);
        }
    }

    return (
        <div>
            <h2>Inscription</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;