class Caroussel {
    constructor(category, title) {
        this.category = category
        this.title = title
        this.position = 0

        
        let movieWidth = getComputedStyle(document.documentElement).getPropertyValue('--movie-width');
        movieWidth = Number(movieWidth.substring(0,movieWidth.length-2))
        let movie_space_between = getComputedStyle(document.documentElement).getPropertyValue('--movie-space-between');
        movie_space_between = Number(movie_space_between.substring(0,movie_space_between.length-2))
        this.scrollWidth = movieWidth + movie_space_between; 

        // containers are refreshed by htmlGenerator
        this.container = document.querySelector(".caroussel_" + category)
        this.containerToScroll = document.querySelector(".category_" + category)
        this.leftButton = document.querySelector(".caroussel_" + category + " > .left_button")
        this.rightButton = document.querySelector(".caroussel_" + category + " > .right_button")
    }

    load_image(page, image_id, image_num) {
        let urlPage = BEST_MOVIES_URL + "&page=" + page + "&genre=" + this.category.replace('best','')
        bestMovies = fetchUrl(urlPage);
        bestMovies.then(value => {
            let bestMovies_data = fetchUrl(value.results[image_id].url);
            bestMovies_data.then(movie_data => {
                let image_selector = ".category_" + this.category + " .movie_item_" + image_num
                let img = document.createElement('img');
                img.setAttribute('src',  movie_data.image_url);
                img.setAttribute('alt', "image_" + image_num);
                // add img to image_selector
                document.querySelector(image_selector).appendChild(img);
                document.querySelector(image_selector).addEventListener(
                    "click", function()  {showModal(movie_data);}
                    );         
            })
        });
    }
    
    load_all_images() {
        let image_num = 1;
        for (let imagePos=0; imagePos <5; imagePos++) {
            this.load_image(1, imagePos, image_num);
            image_num++;
            this.nb_images++;
        }
        // Read the next page ?
        for (let imagePos=0; imagePos <2; imagePos++) {
            this.load_image(2, imagePos, image_num);
            image_num++;
            this.nb_images++;
        }    
    }

    setButtonVisibiltity() {
        let maxScrollWidth = this.containerToScroll.scrollWidth - this.containerToScroll.clientWidth
        if (this.position === 0) {
            this.leftButton.style.visibility = "hidden";
            this.rightButton.style.visibility = "visible";
        } else if (this.position > 0 && this.position + this.scrollWidth <= maxScrollWidth) {
            this.leftButton.style.visibility = "visible";
            this.rightButton.style.visibility = "visible";
        } else if (this.position + this.scrollWidth >= maxScrollWidth) {
            this.rightButton.style.visibility = "hidden";
            this.leftButton.style.visibility = "visible";
        }
    }

    scrollTo(direction) {
        // all images must be loaded
        console.log(this.scrollWidth)
        console.log(this.scrollWidth*6)
        console.log(this.containerToScroll.scrollWidth)
        if (this.containerToScroll.scrollWidth > this.scrollWidth*6) { 
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