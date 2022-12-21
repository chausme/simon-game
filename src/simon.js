class Simon {
    #order = [];

    #playerOrder = [];

    #flash;

    #turn;

    #success;

    #compTurn;

    #intervalId;

    #strict = false;

    #sound = true;

    #on = false;

    #win;

    #turnCounter = document.querySelector('.count');

    #btnGreen = document.querySelector('.top-left');

    #btnRed = document.querySelector('.top-right');

    #btnBlue = document.querySelector('.bottom-right');

    #btnYellow = document.querySelector('.bottom-left');

    #btnOn = document.querySelector('#power');

    #btnStart = document.querySelector('#start');

    #btnStrict = document.querySelector('#strict');

    init() {
        this.#btnOn.addEventListener('change', e => {
            this.#on = e.currentTarget.checked;
            if (this.#on) {
                this.#btnStart.classList.remove('disabled');
                this.#turnCounter.value = '-';
            } else {
                this.#btnStart.classList.add('disabled');
                this.#turnCounter.value = '';
            }
        });
    }
}

export default Simon;
