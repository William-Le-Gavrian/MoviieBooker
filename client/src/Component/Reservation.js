import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/reservation.css"

const Reservation = () => {
    const [movieId, setMovieId] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!movieId || !timeStart) {
            setError('Tous les champs doivent être remplis.');
            return;
        }

        const reservationData = {
            movieId: Number(movieId),
            timeStart: timeStart,
        };

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('Vous devez être connecté pour faire une réservation.');
                return;
            }

            const response = await axios.post('http://localhost:3001/reservation', reservationData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                navigate('/');
            }
        } catch (e) {
            setError(e.response ? e.response.data.message : 'Une erreur est survenue.');
        }
    };

    return (
        <div>
            <h2>Réserver un film</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="film-id">
                    <label>ID du film</label>
                    <input
                        type="number"
                        value={movieId}
                        onChange={(e) => setMovieId(e.target.value)}
                        placeholder="ID du film"
                        required
                    />
                </div>
                <div className="date-reservation">
                    <label>Date et Heure de réservation</label>
                    <input
                        type="datetime-local"
                        value={timeStart}
                        onChange={(e) => setTimeStart(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Réserver</button>
            </form>
        </div>
    );
};

export default Reservation;
