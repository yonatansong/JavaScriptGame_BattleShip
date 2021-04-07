
function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton; //maybe a better practice
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLoc()
};
function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}
function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = ""
}
window.onload = init;
let controller = {
    guesses: 0,
    parseGuess: function (guess) {
        let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
        if (guess === null || guess.length !== 2) {
            alert("Oops, you might accidently type the wrong format of coordinate");
        }
        else {
            firstChar = guess.charAt(0);
            let row = alphabet.indexOf(firstChar); //return negative if not found
            let column = guess.charAt(1) - 1 + "";
            console.log(row + column)
            if (isNaN(row) || isNaN(column)) {
                alert("Oops, that isn't on the board.");
            }
            else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
                alert("Oops, that's off the board");
            }
            else {
                return row + column;
            }
        } //concatenating to make a string "id"
        return null;
    },
    processGuess: function (guess) {
        let location = this.parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships in "
                    + this.guesses + " guesses");
            }
        }
    }
}
let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    generateShipLoc: function () {
        let locations;
        for (let i = 0; 0 < this.numShips; i++) {
            do {
                locations = this.generateShip();
            }
            while (this.collision(locations));
            this.ships[i].locations = locations
        }
    },
    generateShip: function () {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        if (direction === 1) {
            row = board = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
        else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newShipLoc = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLoc.push(row + "" + (col + i));
            }
            else {
                newShipLoc.push((row + i) + "" + col);
            }
        }
        return newShipLoc;
    },
    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < location.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }],
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("hit!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }//method fire berhenti dan memberi nilai true
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.numShips; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        } //iterasi berhenti dan langsung memberikan nilai false 
        return true;
    }
};
let view = {
    displayMessage: function (msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        let coordinate = document.getElementById(location);
        coordinate.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        let coordinate = document.getElementById(location);
        coordinate.setAttribute("class", "miss");
    }
};