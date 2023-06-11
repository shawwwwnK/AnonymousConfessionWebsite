export const Order = {
    LATEST: 0,
    POPULAR: 1
};

export default class Filter {
    constructor(app) {
        this.order = Order.LATEST;
        this.app = app;

        this.onLatest = this.onLatest.bind(this);
        this.onPopular = this.onPopular.bind(this);

        this.latestButton = document.querySelector("#latest");
        this.latestButton.addEventListener("click", this.onLatest);
        this.latestButton.classList.add("activated");
        this.popularButton = document.querySelector("#mostPopular");
        this.popularButton.addEventListener("click", this.onPopular);
    }

    async onLatest(){
        this.order = Order.LATEST;
        if (!this.latestButton.classList.contains("activated")){
            this.latestButton.classList.add("activated");
        }
        if (this.popularButton.classList.contains("activated")){
            this.popularButton.classList.remove("activated");
        }
        await this.app._loadFeed();
    }

    async onPopular(){
        this.order = Order.POPULAR;
        if (!this.popularButton.classList.contains("activated")){
            this.popularButton.classList.add("activated");
        }
        if (this.latestButton.classList.contains("activated")){
            this.latestButton.classList.remove("activated");
        }
        await this.app._loadFeed();
    }
}