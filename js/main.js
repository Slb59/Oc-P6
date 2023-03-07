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

function show_image(page, category, image_id, image_num) {
    urlPage = BEST_MOVIES_URL + "&page=" + page
    console.log(urlPage)
    bestMovies = fetch_url(urlPage);
    console.log(bestMovies)
    bestMovies.then(value => {
        bestMovies_data = fetch_url(value.results[image_id].url);
        bestMovies_data.then(movie_data => {
            let image_selector = ".category_" + category + " .movie_item_" + image_num
            let img = document.createElement('img');
            img.setAttribute('src',  movie_data.image_url);
            img.setAttribute('alt', "image_" + image_num);
            document.querySelector(image_selector).appendChild(img);
        })
    });
}

// const CAROUSSEL_LIST = ["best", "adventure", "animation", "biography"]
const CAROUSSEL_LIST = ["best"]
let carousselPositions = [0, 0, 0, 0]
for (let category of CAROUSSEL_LIST) {
    console.log(category)
    let image_num = 1
    for (let imagePos=0; imagePos <5; imagePos++) {
        show_image(1, category, imagePos, image_num);
        image_num++;
    }
    for (let imagePos=0; imagePos <2; imagePos++) {
        show_image(2, category, imagePos, image_num);
        image_num++
    }    
}


function scroll_caroussel(category, direction) {
    let carousselNum = 0 // 0 for the best category    
    console.log(category + "->" + direction)    
    let containerToScroll = document.querySelector(".category_" + category)
    // ?????????????????????????????????????????
    let head= document.querySelector('body')
    let movieWidth = getComputedStyle(head).getPropertyValue('--movie_width')
    console.log(movieWidth)
    let scrollWidth = 182 + 5
    // scroll the container
    if (direction === "left") {
        containerToScroll.scroll({left: -(scrollWidth), top:0, behavior: 'smooth'})
        carousselPositions[carousselNum]  -= scrollWidth
    }
    else if (direction === "right") {
        containerToScroll.scroll({left: (scrollWidth), top:0, behavior: 'smooth'})
        carousselPositions[carousselNum]  += scrollWidth
    }
    // set visibility of buttons
    let carousselPos = carousselPositions[carousselNum]
    console.log(carousselPos)
    console.log(containerToScroll.scrollWidth)
    console.log(containerToScroll.clientWidth)
    console.log(containerToScroll.offsetWidth)
    let leftButton = document.getElementsByClassName('left_button')[carousselNum]
    let rightButton = document.getElementsByClassName('right_button')[carousselNum]
    if (carousselPos === 0) {
        leftButton.style.visibility = "hidden";
    } else if (carousselPos > 0 && carousselPos < containerToScroll.scrollWidth) {
        leftButton.style.visibility = "visible";
        rightButton.style.visibility = "visible";
    } else if (carousselPos === containerToScroll.scrollWidth) {
        rightButton.style.visibility = "hidden";
    }
}

