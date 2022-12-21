class Simon {
    #colors = ['green', 'red', 'blue', 'yellow'];

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

    // Helper for getting color based turn index
    #getTurnIndex = color => {
        return this.#colors.indexOf(color) + 1;
    };

    // Helper for getting color button since JS private properties can't be dynamic
    #getColorBtn = color => {
        if (color === 'green') {
            return this.#btnGreen;
        } else if (color === 'red') {
            return this.#btnRed;
        } else if (color === 'blue') {
            return this.#btnBlue;
        } else if (color === 'yellow') {
            return this.#btnYellow;
        }
    };

    // Reset highlighted color if any
    #resetColor = () => {
        console.log('color reset');
        if (document.querySelector('.highlighted')) {
            document.querySelector('.highlighted').classList.remove('highlighted');
        }
    };

    // Flash particular color button
    #flashColor = color => {
        console.log(`flash color: ${color}`);
        if (this.#sound) {
            let audio = document.querySelector(`audio[data-color="${color}"]`);
            audio.play();
        }
        this.#sound = true;
        this.#getColorBtn(color).classList.add('highlighted');
    };

    // Process a single game turn
    #gameTurn = () => {
        console.log('game turn');
        this.#on = false;

        console.log(this.#flash);

        // Computer turn is completed
        if (this.#flash === this.#turn) {
            clearInterval(this.#intervalId);
            this.#compTurn = false;
            this.#resetColor();
            this.#on = true;
        }

        // Process computer turn
        if (this.#compTurn) {
            this.#resetColor();
            setTimeout(() => {
                if (this.#order[this.#flash] === 1) {
                    this.#flashColor('green');
                } else if (this.#order[this.#flash] === 2) {
                    this.#flashColor('red');
                } else if (this.#order[this.#flash] === 3) {
                    this.#flashColor('blue');
                } else if (this.#order[this.#flash] === 4) {
                    this.#flashColor('yellow');
                }
                this.#flash += 1;
            }, 200);
        }
    };

    // Start the game
    #play = () => {
        console.log('play');
        // Reset a few values
        this.#win = false;
        this.#order = [];
        this.#playerOrder = [];
        this.#flash = 0;
        this.#intervalId = null;
        this.#turn = 1;
        this.#turnCounter.textContent = 1;
        this.#success = true;
        // Get a list of random color turns
        for (let i = 0; i < 20; i++) {
            this.#order.push(Math.floor(Math.random() * 4) + 1);
        }
        this.#compTurn = true;
        this.intervalId = setInterval(this.#gameTurn, 800);
        console.log(this.#order);
    };

    init() {
        // Check for "on" status and update output accordingly
        this.#btnOn.addEventListener('change', e => {
            this.#on = e.currentTarget.checked;
            if (this.#on) {
                this.#btnStart.classList.remove('disabled');
                this.#turnCounter.value = '-';
            } else {
                this.#btnStart.classList.add('disabled');
                this.#turnCounter.value = '';
                this.#resetColor();
                clearInterval(this.#intervalId);
            }
        });

        // Check for "strict" status
        this.#btnStrict.addEventListener('change', e => {
            this.#strict = e.currentTarget.checked;
        });

        // Start the game
        this.#btnStart.addEventListener('click', () => {
            if (this.#on || this.#win) {
                this.#play();
            }
        });

        // Process color button clicks
        document.querySelectorAll('.button').forEach(btn => {
            btn.addEventListener('click', e => {
                if (this.#on) {
                    const color = e.currentTarget.dataset.color;
                    const turnIndex = this.#getTurnIndex(color);
                    this.#playerOrder.push(turnIndex);
                    //this.#check()
                    console.log(this);
                    this.#flashColor(color);
                    if (!this.#win) {
                        setTimeout(() => {
                            this.#resetColor();
                        }, 300);
                    }
                }
            });
        });
    }
}

export default Simon;
