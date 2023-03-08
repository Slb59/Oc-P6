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

class Caroussel {
    constructor(category, title) {
        this.category = category
        this.title = title
        this.position = 0
        this.scrollWidth = 182 + 5; // Comment utiliser les variables css ?
        this.container = document.querySelector(".caroussel_" + category)
        this.containerToScroll = document.querySelector(".category_" + category)
        this.leftButton = document.querySelector(".caroussel_" + category + " > .left_button")
        this.rightButton = document.querySelector(".caroussel_" + category + " > .right_button")
    }

    load_image(page, image_id, image_num) {
        let urlPage = BEST_MOVIES_URL + "&page=" + page + "&genre=" + this.category.replace('best','')
        console.log(urlPage)
        bestMovies = fetch_url(urlPage);
        console.log(bestMovies)
        bestMovies.then(value => {
            let bestMovies_data = fetch_url(value.results[image_id].url);
            bestMovies_data.then(movie_data => {
                let image_selector = ".category_" + this.category + " .movie_item_" + image_num
                let img = document.createElement('img');
                img.setAttribute('src',  movie_data.image_url);
                img.setAttribute('alt', "image_" + image_num);
                document.querySelector(image_selector).appendChild(img);
            })
        });
    }
    
    load_all_images() {
        let image_num = 1;
        for (let imagePos=0; imagePos <5; imagePos++) {
        this.load_image(1, imagePos, image_num);
        image_num++;
        }
        for (let imagePos=0; imagePos <2; imagePos++) {
        this.load_image(2, imagePos, image_num);
        image_num++;
        }    
    }

    setButtonVisibiltity(){
        console.log(this.position);
        console.log(this.containerToScroll.scrollWidth);
        console.log(this.containerToScroll.clientWidth);
        console.log(this.containerToScroll.offsetWidth);
        // let leftButton = document.getElementsByClassName('left_button')[carousselNum]
        // let rightButton = document.getElementsByClassName('right_button')[carousselNum]
        if (this.position === 0) {
            this.leftButton.style.visibility = "hidden";
        } else if (this.position > 0 && this.position + this.scrollWidth < this.containerToScroll.clientWidth) {
            this.leftButton.style.visibility = "visible";
            this.rightButton.style.visibility = "visible";
        } else if (this.position + this.scrollWidth >= this.containerToScroll.clientWidth) {
            this.rightButton.style.visibility = "hidden";
        }
    }

    scrollTo(direction) {

        console.log(this.category + "->" + direction);    
        
        // ?????????????????????????????????????????
        // let head= document.querySelector('body');
        // let movieWidth = getComputedStyle(head).getPropertyValue('--movie_width');
        // console.log(movieWidth);
      
        
        // scroll the container
        if (direction === "left") {
            this.containerToScroll.scroll({left: this.position-(this.scrollWidth), top:0, behavior: 'smooth'});
            this.position  -= this.scrollWidth;
        }
        else if (direction === "right") {
            console.log('vers la droite')
            this.containerToScroll.scroll({left: this.position + (this.scrollWidth), top:0, behavior: 'smooth'});
            this.position  += this.scrollWidth;
        }
        // set visibility of buttons
        this.setButtonVisibiltity();

    }

    htmlGenerator() {
        let htmlToAdd = "<h2>" + this.title + "</h2>"
        htmlToAdd += "<a class=\"left_button\" onclick=\"scroll_caroussel('" + this.category + "', 'left')\">";
        htmlToAdd += "<img src=\"assets/flèche-left.png\" alt=\"fleche\" width=\"100px\">";
        htmlToAdd += "</a>";
        htmlToAdd += "<div class=\"category_" + this.category + " category_movies\">";
        htmlToAdd += "<div class=\"movie_item_1\"></div>";
        htmlToAdd += "<div class=\"movie_item_2\"></div>";
        htmlToAdd += "<div class=\"movie_item_3\"></div>";
        htmlToAdd += "<div class=\"movie_item_4\"></div>";
        htmlToAdd += "<div class=\"movie_item_5\"></div>";
        htmlToAdd += "<div class=\"movie_item_6\"></div>";
        htmlToAdd += "<div class=\"movie_item_7\"></div>";
        htmlToAdd += "</div>";
        htmlToAdd += "<a class=\"right_button\" onclick=\"scroll_caroussel('" + this.category + "', 'right')\">";
        htmlToAdd += "<img src=\"assets/flèche-right.png\" alt=\"fleche\" width=\"100px\">";
        htmlToAdd += "</a>";
        this.container.innerHTML = htmlToAdd;
        this.containerToScroll = document.querySelector(".category_" + this.category);
        this.leftButton = document.querySelector(".caroussel_" + this.category + " > .left_button")
        this.rightButton = document.querySelector(".caroussel_" + this.category + " > .right_button")
    }
}

const CAROUSSEL_LIST = ["best", "adventure", "animation", "biography"]
const CAROUSSEL_TITLES = [
    "", 
    "Les meilleurs films d'aventure",
    "Les meilleurs films d'animation",
    "Les meilleurs biographies"
]

let carousselList = []
// const carousselList = [
//     new Caroussel("best"), 
//     new Caroussel("adventure"), 
//     new Caroussel("animation"),
//     new Caroussel("biography")
// ]

for (let i in CAROUSSEL_LIST) {
    let aCaroussel = new Caroussel(CAROUSSEL_LIST[i], CAROUSSEL_TITLES[i]);
    carousselList.push(aCaroussel);
    aCaroussel.htmlGenerator();
    aCaroussel.load_all_images();
}

// for (let aCaroussel of carousselList) {
//     aCaroussel.load_all_images();
// }



// const CAROUSSEL_LIST = ["best", "adventure", "animation", "biography"]
// const CAROUSSEL_LIST = ["best"]
// let carousselPositions = [0, 0, 0, 0]


function scroll_caroussel(category, direction) {
    if (category === "best") {carousselList[0].scrollTo(direction);}    
    if (category === "adventure") {carousselList[1].scrollTo(direction);}
    if (category === "animation") {carousselList[2].scrollTo(direction);}
    if (category === "biography") {carousselList[3].scrollTo(direction);}
}

