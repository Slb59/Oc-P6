const URL_API = "http://localhost:8000/api/v1/titles/"
const BEST_MOVIES_URL = URL_API + "?sort_by=-imdb_score"

async function fetchUrl(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (err) {
        return console.log("Problem with fetch:" + err);
    }
}

function show_best_movie(){
    bestMovies = fetchUrl(BEST_MOVIES_URL);
    bestMovies.then(value => {
        bestMovies_data = fetchUrl(value.results[0].url);
        bestMovies_data.then(movie_data => {
            document.getElementById("best_movie_title").innerHTML = movie_data.title
            document.getElementById("best_movie_summary").innerHTML = movie_data.description
            document.getElementById("best_movie_img").src = movie_data.image_url
            document.getElementById("play_btn").addEventListener(
                "click", function()  {showModal(movie_data);}
                );            
        }
            )
    });
}

show_best_movie();

const CAROUSSEL_LIST = ["best", "adventure", "animation", "biography"]
const CAROUSSEL_TITLES = [
    "", 
    "Les meilleurs films d'aventure",
    "Les meilleurs films d'animation",
    "Les meilleurs biographies"
]

let carousselList = []

for (let i in CAROUSSEL_LIST) {
    let aCaroussel = new Caroussel(CAROUSSEL_LIST[i], CAROUSSEL_TITLES[i]);
    carousselList.push(aCaroussel);
    aCaroussel.htmlGenerator();
    aCaroussel.load_all_images();
}

function scroll_caroussel(category, direction) {
    let i = CAROUSSEL_LIST.indexOf(category)
    carousselList[i].scrollTo(direction);    
}

let modal = document.querySelector(".movie_modal")

function showModal(movie_data) {
    console.log(movie_data);
    // http://localhost:8000/api/v1/titles/499549
    
    modal.style.display = "block";
    document.querySelector(".movie_title").innerHTML = "<h2>" + movie_data.title + "</h2>";
    htmlToAdd = "<img src=\"" + movie_data.image_url + "\" alt=\"image\">";
    document.querySelector(".movie_img").innerHTML = htmlToAdd;
    document.querySelector(".movie_description").innerHTML = "<p>" + movie_data.description + "</p>";
    document.querySelector(".movie_genre").innerHTML = "<p>Genres: " + movie_data.genres + "</p>";
    const d = new Date(movie_data.date_published);
    document.querySelector(".movie_published").innerHTML = "<p>Sortie: " +d.toLocaleDateString("fr") + "</p>";
    // ou vote ? ou avg_vote ?
    document.querySelector(".movie_rated").innerHTML = "<p>Note: " + movie_data.rated + "</p>";
    document.querySelector(".movie_imdb").innerHTML = "<p>Score imdb: " + movie_data.imdb_score + "</p>";
    document.querySelector(".movie_directors").innerHTML = "<p>Réalisateurs: " + movie_data.directors + "</p>";
    // use a grid 
    document.querySelector(".movie_actors").innerHTML = "<p>Acteurs: " + movie_data.actors + "</p>";
    // unité ??
    document.querySelector(".movie_duration").innerHTML = "<p>Durée: " + movie_data.duration + "</p>";
    document.querySelector(".movie_countries").innerHTML = "<p>Pays: " + movie_data.countries + "</p>";
    if (movie_data.worldwide_gross_income == null) {
        document.querySelector(".movie_income").innerHTML = "<p>Recettes non connues</p>";
    } else {    
        document.querySelector(".movie_income").innerHTML = 
            "<p>Recettes: " + movie_data.worldwide_gross_income.toString() + " " + movie_data.budget_currency + "</p>";
    }
    // close button
    document.getElementsByClassName("movie_modal__window__close__triangle-left")[0].addEventListener(
        "click", function()  {modal.style.display = "none";}
        );   
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
