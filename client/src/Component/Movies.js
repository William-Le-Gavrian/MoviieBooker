import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Reservation from "./Reservation";
import '../styles/movies.css'

const Movies = () => {
    const [user, setUser] = useState({});
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(0); // Nouveau state pour le total de pages

    const fetchMovies = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:3001/movies', {
                params: {
                    page,
                    search,
                    sort,
                },
            });

            setMovies(response.data.results);
            setTotalPages(response.data.total_pages); // Mise à jour du total de pages
        } catch (err) {
            setError('Erreur lors du chargement des films');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [page, search, sort]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access_token');

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
        }
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    return (
        <div className="movies-container">
            <h2>Liste des films</h2>
            {user && <h3>{user.email}</h3>}
            <div className="filters-container">
                <div className="search-container">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Rechercher des films"
                    />
                </div>

                <div className="sort-container">
                    <select onChange={handleSortChange} value={sort}>
                        <option value="">Trier par</option>
                        <option value="popularity.asc">Popularité croissante</option>
                        <option value="popularity.desc">Popularité décroissante</option>
                        <option value="release_date.asc">Date de sortie croissante</option>
                        <option value="release_date.desc">Date de sortie décroissante</option>
                    </select>
                </div>
            </div>
            {loading && <p>Chargement...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            <div className="movies-list">
                {movies.length === 0 ? (
                    <p>Aucun film trouvé</p>
                ) : (
                    movies.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <h3>{movie.title}</h3>
                            <h4>Popularité : {movie.popularity}</h4>
                            <h5>ID du film : {movie.id}</h5>
                            <p className="overview">{movie.overview}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                    Précédent
                </button>
                <span>Page {page} sur {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                    Suivant
                </button>
            </div>

            {user ? (
                <Reservation />
            ) : null}
        </div>
    );
};

export default Movies;
