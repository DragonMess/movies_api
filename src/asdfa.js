import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";
const URL = "https://react-http-1965e-default-rtdb.firebaseio.com/";
function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL}movies.json`);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const loadedMovies = [];
      for (let id in data) {
        loadedMovies.push({
          id: id,
          title: data[id].title,
          openingText: data[id].opening_crawl,
          releaseDate: data[id].release_date,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(`${URL}movies.json`, {
      method: "POST",
      body: JSON.stringify(movie),
      header: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
