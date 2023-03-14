class Caroussel {
    constructor(category, title) {
        this.category = category
        this.title = title
        this.position = 0
        this.nb_images = 0

        this.scrollWidth = 182 + 5; // TODO : Comment utiliser les variables css ?
        // ?????????????????????????????????????????
        // let head= document.querySelector('body');
        // let movieWidth = getComputedStyle(head).getPropertyValue('--movie_width');
        // console.log(movieWidth);

        // container are refreshed by htmlGenerator
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
                // TODO : revoir le fonctionnement de appendChild
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
        console.log(this.position);
        console.log(this.containerToScroll.scrollWidth);
        console.log(this.containerToScroll.clientWidth);
        console.log(this.containerToScroll.offsetWidth);
        // let leftButton = document.getElementsByClassName('left_button')[carousselNum]
        // let rightButton = document.getElementsByClassName('right_button')[carousselNum]
        let maxScrollWidth = this.containerToScroll.scrollWidth - this.containerToScroll.clientWidth
        console.log(this.position + this.scrollWidth)
        console.log(maxScrollWidth)
        if (this.position === 0) {
            this.leftButton.style.visibility = "hidden";
            this.rightButton.style.visibility = "visible";
        } 
        if (this.position > 0 && this.position + this.scrollWidth <= maxScrollWidth) {
            this.leftButton.style.visibility = "visible";
            this.rightButton.style.visibility = "visible";
        } 
        if (this.position + this.scrollWidth >= maxScrollWidth) {
            this.leftButton.style.visibility = "visible";
            this.rightButton.style.visibility = "hidden";
        }
    }

    scrollTo(direction) {
        if (this.nb_images >= 7) {
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