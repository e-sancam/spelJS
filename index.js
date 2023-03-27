const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),//You can start the game by pressing the button or just flipp a card
    restart: document.querySelector('.restart'),
    win: document. querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0, //Keep track of the total number of flips, only two cards can be flipped at the same time//
    totalFlips: 0, //Kepp track of all the number of the moves and the slapsed time.
    totalTime: 0,
    loop: null,
    gameEnded: false
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1)) //Create a random index (Math.random returns a random number between 0 and 1) this can be use to switch the position of two items in the array.
        const original = clonedArray[i]

        clonedArray[i] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original 
    }

    return clonedArray

}


//Everytime that the player flip a card and doesnt match, the card will flip back. 
const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for(let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)

    }

        return randomPicks

}
//
const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error ("The dimension of the board must be an even number.")
    }

    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍']
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2)
    const items = shuffle([...picks, ...picks]) //Pass this for shuffle
    const cards = ` 
             <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
                  ${items.map(item => ` 
                        <div class="card">
                            <div class="card-front"></div>
                            <div class="card-back">${item}</div>
                        </div>    
                                     
                        `).join('')}

                        </div>
                   `
                   
                   const parser = new DOMParser().parseFromString(cards, 'text/html') //Provides the ability to examine in this case HTML source code from a string into a DOM Document.

                   selectors.board.replaceWith(parser.querySelector('.board'))
        }

const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled') //Disable the button is to prevent starting the game over and over agai after it has already been started.

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves` //Shows how many minutes and moves the player is making.
        selectors.timer.innerText = `Time: ${state.totalTime} sec`
    }, 1000)
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => { //Its only called this function if the cards has not been flipped yet.
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if(state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
                flipBackCards()
        }, 1000)
    }

//If there aren't more cards to flip, the player has won the game//
if (!document.querySelectorAll('.card:not(.flipped)').length) {
    setTimeout(() => {
        state.gameEnded = true
        selectors.start.classList.remove('disabled')
        selectors.boardContainer.classList.add('flipped')
        selectors.win.innerHTML =  `
        <span class="win-text"> 
            You won!<br />
            with <span class="highlight">${state.totalFlips}</span> moves<br />
            under <span class="highlight">${state.totalTime}</span> seconds
            </span>
        `
        //This is the Win text, when you win, the board is going to flip and show how many moves and minutes the player used. 
        attachEventListeners()
            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
        if (state.gameEnded) {window.location.reload();}
    })
}


generateGame()
attachEventListeners()