const URL_API = "http://localhost:8000/api/v1/titles/"
const BEST_MOVIE = URL_API + "?sort_by=-imdb_score"

function fetch_url(url) {
    return fetch(url)
    .then(response => response.json())
    .catch(err => console.log("Problem with fetch:" + err));
}

console.log("test...");
bestMovies = fetch_url(BEST_MOVIE);
console.log(bestMovies);
bestMovies.then(value => {
    console.log(value.results[0].url);
    bestMovies_data = fetch_url(value.results[0].url);
    console.log(bestMovies_data)
    console.log(bestMovies_data.title)
    bestMovies_data.then(movie_data => {
        console.log(movie_data.title)
        document.getElementById("best_movie_title").innerHTML = movie_data.title
        document.getElementById("best_movie_summary").innerHTML = movie_data.description
        document.getElementById("best_movie_img").src = movie_data.image_url
    }
        )
});
