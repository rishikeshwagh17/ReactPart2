import { useEffect, useState } from "react";

export function useMovies(KEY, query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      async function getMoviesData() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`
          );
          if (!res.ok) {
            throw new Error("something went wrong with fetching movies");
          }
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movies not found");
          setMovies(data.Search);
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query?.length >= 3) {
        getMoviesData();
      } else {
        setMovies([]); // Clear movies if the query is too short
        setError("");
      }
    }, 500); // 500ms debounce interval

    return () => clearTimeout(timeoutId); // Clear timeout on query change
  }, [query, KEY]);

  return { movies, isLoading, error };
}
