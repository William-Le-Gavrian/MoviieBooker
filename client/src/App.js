import './App.css';
import Movies from "./Component/Movies";
import Register from "./Component/Register";
import Login from "./Component/Login";
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
import Header from "./Component/Header";

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Movies />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
