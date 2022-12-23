class Simon {
    #maxTurnsAmount = 20; // amount to win the game

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
    #getTurnIndex = color => this.#colors.indexOf(color) + 1;

    // Helper for getting color button since JS private properties can't be dynamic
    #getColorBtn = (color = 'green') => {
        if (color === 'red') {
            return this.#btnRed;
        }
        if (color === 'blue') {
            return this.#btnBlue;
        }
        if (color === 'yellow') {
            return this.#btnYellow;
        }
        return this.#btnGreen;
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
        console.log(`flashColor: sound = ${this.#sound}, color = ${color}`);
        if (this.#sound) {
            const audio = document.querySelector(`audio[data-color="${color}"]`);
            audio.play();
        }
        this.#sound = true;
        this.#getColorBtn(color).classList.add('highlighted');
    };

    // Set the game as won
    #setGameWon = () => {
        console.log('heads up, you won the game');
    };

    // Check player's turn
    #check = color => {
        // Check if the last button player has clicked on isn't equal to actual order[] item
        // and set success to false if it's the case i.e. lost the game
        const lastIndex = this.#playerOrder.length - 1;
        if (this.#playerOrder[lastIndex] !== this.#order[lastIndex]) {
            this.#success = false;
        }
        // Check if player has the right amount of correct turns based on #maxTurnsAmount and success === true
        // and then set the game as won
        if (this.#playerOrder.length === this.#maxTurnsAmount && this.#success) {
            this.#setGameWon();
        }
        // Check if player has success === false
        if (!this.#success) {
            // Flash the color and show "no" message
            this.#flashColor(color);
            this.#turnCounter.value = 'No!';
            setTimeout(() => {
                // Reset turn and color
                this.#turnCounter.value = this.#turn;
                this.#resetColor();

                // CHeck if player is in strict mode
                if (this.#strict) {
                    // Reset the entire game
                    this.#play();
                } else {
                    // Otherwise @todo refactor
                    this.#compTurn = true;
                    this.#flash = 0;
                    this.#playerOrder = [];
                    this.#success = true;
                    this.#intervalId = setInterval(this.#gameTurn, 800);
                }
            }, 800);

            this.#sound = false;
        }
    };

    // Process a single game turn
    #gameTurn = () => {
        console.log('game turn');
        this.#on = false;

        console.log(`this.#flash = ${this.#flash}`);
        console.log(`this.#turn = ${this.#turn}`);

        // Computer turn is completed
        if (this.#flash === this.#turn) {
            console.log('computer turn is completed');
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
        this.#turnCounter.value = 1;
        this.#success = true;
        // Get a list of random color turns
        for (let i = 0; i < this.#maxTurnsAmount; i += 1) {
            this.#order.push(Math.floor(Math.random() * 4) + 1);
        }
        this.#compTurn = true;
        this.#intervalId = setInterval(this.#gameTurn, 800);
        console.log(this.#order);
    };

    init() {
        // Check for "on" status and update settings accordingly
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
                    const { color } = e.currentTarget.dataset;
                    const turnIndex = this.#getTurnIndex(color);
                    this.#playerOrder.push(turnIndex);
                    this.#check(color);
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
