import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

class RevealOnScroll {
    constructor(elements, thresholdPercent) {
        this.thresholdPercent = thresholdPercent;
        this.itemsToReveal = elements;
        this.browserHeight = window.innerHeight;
        this.hideInitially();
        this.scrollThrottle = throttle(this.calcCaller, 200).bind(this);
        this.events();
    }

    events() {
        window.addEventListener("scroll", this.scrollThrottle);
        window.addEventListener("resize", debounce(() => {
            // console.log("Resize just ran");
            this.browserHeight = window.innerHeight;
        }, 300));
    }

    calcCaller() {
        // console.log("scroll function ran");
        this.itemsToReveal.forEach(el => {
            if(el.isRevealed == false) {
                this.calculateIfScrolledTo(el);
            }
        })
    }

    calculateIfScrolledTo(el) {
        if(window.scrollY + this.browserHeight > el.offsetTop) {
            // console.log("Element was calculated");
            // el.getBoundingClientRect().top for microsoft edge
            let scrollPercent = (el.getBoundingClientRect().y / this.browserHeight) * 100;
            if (scrollPercent < this.thresholdPercent) {
                el.classList.add("reveal-item--is-visible");
                el.isRevealed = true;
                if(el.isLastItem == true) {
                    window.removeEventListener("scroll", this.scrollThrottle);
                }
            }
            // console.log(el.getBoundingClientRect().y);
        }
    }

    hideInitially() {
        this.itemsToReveal.forEach(el => {
            el.classList.add("reveal-item");
            el.isRevealed = false;
        });
        this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true;
    }
}
export default RevealOnScroll;