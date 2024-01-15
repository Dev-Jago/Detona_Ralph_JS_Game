document.body.style.cursor = 'none';

let isMouseDown = false;

document.addEventListener('mousemove', (event) => {
    if (!isMouseDown) {
        document.body.style.setProperty('--cursorX', `${event.clientX - 8}px`);
        document.body.style.setProperty('--cursorY', `${event.clientY - 8}px`);
    }
});

const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        currentLife: 5,
        loopTimeoutId: null,
    },

    actions: {
        countDownTimerId: setInterval(countDown, 1000),
    },
    audio: {
        skip: "skip.wav",
        explosionGoo: "sfx_explosionGoo.ogg",
        miss: "miss.ogg",
        gameOver: "game-over.wav",
    },
};

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.values.loopTimeoutId);
        playSound(state.audio.gameOver);
        alert("Game Over! O seu resultado foi: " + state.values.result);
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audio/${audioName}`);
    audio.volume = 0.5;

    audio.addEventListener('error', function (e) {
        console.error('Erro ao carregar o áudio');
    });

    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });
    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
    playSound(state.audio.skip);
}

function startGameLoop() {
    function loop() {
        var skipTime = Math.round((Math.random() * 1300) + 250);
        state.values.loopTimeoutId = setTimeout(function () {
            randomSquare();
            loop();
        }, skipTime);
    }

    loop();
}

function handleHit() {
    state.values.result++;
    state.view.score.textContent = state.values.result;
    playSound(state.audio.explosionGoo);
}

function handleMiss() {
    if (state.values.currentLife > 1) {
        state.values.currentLife--;
        state.view.lives.textContent = state.values.currentLife;
        playSound(state.audio.miss);
    } else {
        state.values.currentLife--;
        playSound(state.audio.gameOver);
        clearInterval(state.values.loopTimeoutId);
        alert("Game Over! O seu resultado foi: " + state.values.result);
    }
}

function addListenerHitbox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                handleHit();
            } else {
                handleMiss();
            }
        });
    });
}

function initialize() {
    addListenerHitbox();
    startGameLoop();
}

initialize();