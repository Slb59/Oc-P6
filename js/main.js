const URL_API = "http://localhost:8000/api/v1/titles/"
const BEST_MOVIES_URL = URL_API + "?sort_by=-imdb_score"

function fetch_url(url) {
    return fetch(url)
    .then(response => response.json())
    .catch(err => console.log("Problem with fetch:" + err));
}

function show_best_movie(){
    bestMovies = fetch_url(BEST_MOVIES_URL);
    bestMovies.then(value => {
        bestMovies_data = fetch_url(value.results[0].url);
        bestMovies_data.then(movie_data => {
            document.getElementById("best_movie_title").innerHTML = movie_data.title
            document.getElementById("best_movie_summary").innerHTML = movie_data.description
            document.getElementById("best_movie_img").src = movie_data.image_url
        }
            )
    });
}

show_best_movie();

function show_image(category, image_id) {
    bestMovies = fetch_url(BEST_MOVIES_URL);
    console.log(bestMovies)
    bestMovies.then(value => {
        console.log(value.results[image_id].url)
        bestMovies_data = fetch_url(value.results[image_id-1].url);
        bestMovies_data.then(movie_data => {
            let image_selector = ".category_" + category + " > " + ".movie_elem_" + image_id
            let img = document.createElement('img');
            img.setAttribute('src',  movie_data.image_url);
            img.setAttribute('alt', "image_" + image_id);
            document.querySelector(image_selector).appendChild(img);
        })
    });
}

let caroussel_list = ["best", "adventure", "animation", "biography"]
let caroussel_pos = [1, 1, 1, 1]
for (let category of caroussel_list) {
    console.log(category)
    for (let image_pos=1; image_pos <=4; image_pos++) {
        show_image(category, image_pos);
    }
}

function scroll_caroussel(category, direction) {
    console.log(category + "->" + direction)
    container_to_scroll = document.querySelector(".category_" + category)
    let scroll_width = $movie_width + $movie_space_between
    if (direction == "left") {
        container_to_scroll.scroll({left:400, top:0, behavior: 'smooth'})
    }
    else if (direction == "right") {
        // scroll
    }
}