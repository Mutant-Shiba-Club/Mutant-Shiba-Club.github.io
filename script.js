class AudioController {
    constructor() {
        this.bgMusic = new Audio("Assets/space-chillout-14194.mp3");
        this.flipSound = new Audio("Assets/Assets_Audio_flip.wav");
        this.matchSound = new Audio("Assets/Assets_Audio_match.wav");
        this.victorySound = new Audio("Assets/Assets_Audio_victory.wav");
        this.gameOverSound = new Audio("Assets/Assets_Audio_gameOver.wav");
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById("remaining-time");
        this.ticker = document.getElementById("flips");
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.timeRemaining = this.totalTime;
        this.totalClicks = 0;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && !this.cardToCheck !== card;
    }

    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) this.gameOver();
        }, 1000);
    }

    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add("visible");

            if(this.cardToCheck) {
                this.checkForCardMatch(card)
            } else {
                this.cardToCheck = card;
            }
        }
    }

    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000)
    }
    getCardType(card) {
        return card.getElementsByClassName('dape')[0].src;
    }

    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    triggerMusic(musicIcon) {
        let musicIsOn = true;
        musicIcon.addEventListener('click', () => {
            if (musicIsOn) {
                this.audioController.stopMusic();
                musicIcon.src = "Assets/music-icon-muted.png";
                musicIsOn = false;
            } else {
                this.audioController.startMusic();
                musicIcon.src = "Assets/music-icon.png"
                musicIsOn = true;
            }
        })
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);
    let musicIcon = document.getElementById('music');

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        })
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        })
    })

    game.triggerMusic(musicIcon);
}
