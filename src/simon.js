class Simon {
    // amount of turns to win the game
    #maxTurnsAmount = 10;

    // colors for targetting buttons etc
    #colors = ['green', 'red', 'blue', 'yellow'];

    // current game turns order list
    #order = [];

    // player's turn order list
    #playerOrder = [];

    // current flash number @todo add a proper description
    #flash;

    // current turn number i.e. <= #order.length
    #turn;

    // store computer's turn status i.e. if current turn is computer's
    #compTurn;

    // store player's turn status i.e. if current turn is failed
    #success;

    // store interval's id used for its removal later
    #intervalId;

    // store player's won status
    #win;

    // game settings

    #strict = false;

    #sound = true;

    #on = false;

    // countainer for current turn and "No!" message output
    #turnCounter = document.querySelector('.count');

    // color buttons

    #btnGreen = document.querySelector('.top-left');

    #btnRed = document.querySelector('.top-right');

    #btnBlue = document.querySelector('.bottom-right');

    #btnYellow = document.querySelector('.bottom-left');

    // action buttons

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

    // Reset some of the game state values
    #resetState = () => {
        this.#compTurn = true;
        this.#playerOrder = [];
        this.#flash = 0;
        this.#intervalId = setInterval(this.#gameTurn, 800);
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
    #setGameWin = () => {
        console.log('heads up, you won the game');
        this.#turnCounter.value = 'Win!';
        this.#on = false;
        this.#win = true;
        setTimeout(() => {
            this.#resetColor();
        }, 300);
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
            this.#setGameWin();
        }

        // Check if player has success === false i.e. failed the turn
        if (!this.#success) {
            // Flash the color and show "no" message
            this.#flashColor(color);
            this.#turnCounter.value = 'No!';
            setTimeout(() => {
                // Reset turn and color
                this.#turnCounter.value = this.#turn;
                this.#resetColor();

                // Check if player is in strict mode
                if (this.#strict) {
                    // Reset the entire game
                    this.#play();
                } else {
                    // Otherwise
                    this.#success = true;
                    this.#resetState();
                }
            }, 800);

            this.#sound = false;
        }

        // Check if player did a correct turn
        if (this.#turn === this.#playerOrder.length && this.#success && !this.#win) {
            // Increase turn number
            this.#turn += 1;

            this.#turnCounter.value = this.#turn;
            this.#resetState();
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
                // Increase flash number
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
        this.#intervalId = null;
        this.#turn = 1;
        this.#turnCounter.value = 1;
        this.#success = true;
        // Get a list of random color turns
        for (let i = 0; i < this.#maxTurnsAmount; i += 1) {
            this.#order.push(Math.floor(Math.random() * 4) + 1);
        }
        this.#resetState();
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
