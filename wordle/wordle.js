document.addEventListener("DOMContentLoaded", () => {
    createBlock();
    function createBlock() {
        const keys = document
        const boardGame = document.getElementById("board");
        for (let index = 0; index < 16; index++) {
            const smallBlock = document.createElement("div");
            smallBlock.classList.add("smallBlock");
            smallBlock.setAttribute("id", index);
            boardGame.appendChild(smallBlock);

        }
    }
    const button = document.getElementById("startOver");
    let dictionary;
    const getData = async () => {
        const res = await fetch("https://api.masoudkf.com/v1/wordle", {
            headers: {
                "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
            },
        });
        return await res.json();
    };
    wordle = "";
    hint = "";
    const getWord = async (shouldFetch = true) => {
        if (shouldFetch) {
            data = await getData();
            dictionary = data.dictionary;
        }
        let index = Number.parseInt(Math.random() * 20);
        wordle = dictionary[index].word.toUpperCase();
        hint = dictionary[index].hint;
        console.log(wordle);
        console.log(hint);

    }
    window.addEventListener('online', function(event) {
        location.reload();
      });
    //check if the wifi is not working
    window.addEventListener('offline', function(event) {
        button.disabled = true;
        button.innerText="Loading...";
        sconsole.log("Loading...");
      });
    document.getElementById("startOver").addEventListener("click", () => {
        startover();
    }

    );
    const button1 = document.getElementById("hintbutton");
    document.getElementById("hintbutton").addEventListener("click", () => {
        document.getElementById("hint_content").classList.remove("hidden");
        document.getElementById("hint_content").classList.add("hint_appiled");
        let hint_content = document.getElementsByClassName("hint_appiled");
        hint_content[0].innerText = "Hint:" +hint;
        document.getElementById("hintbutton").blur();
    });
    
    document.getElementById("darkMode").addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        document.getElementById("darkMode").blur();

    });
    
    const instructions = document.getElementById("instructions");
    const instructbut = document.getElementById("instructbut");
    instructbut.addEventListener("click", () => {
        instructions.classList.toggle("hidden");
        document.getElementById("instructbut").blur();
    })

    const state = {
        wordguess: getWord(),
        grid: Array(4)
            .fill()
            .map(() => Array(4).fill('')),
        currentRow: 0,
        currentCol: 0,
    };
    updateGrid();
    function updateGrid() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const smallBlock = document.getElementById(4 * i + j);
                smallBlock.textContent = state.grid[i][j];
            }
        }
    }

    registerKeyboardEvents();
    function registerKeyboardEvents() {
        document.body.onkeyup = (event) => {
            let key = event.key;
            if (key == "Backspace") {
                setTimeout(() => {
                    document.getElementById("char").innerHTML = "&#8592";
                    document.getElementById("char").style.display = "flex";
                }, 20);
                setTimeout(() => {
                    document.getElementById("char").style.display = "none";
                }, 600);
                removeLetter();

            }
            else if (key == "Enter") {
                setTimeout(() => {
                    document.getElementById("char").innerHTML = "&#8617";
                    document.getElementById("char").style.display = "flex";
                }, 20);
                setTimeout(() => {
                    document.getElementById("char").style.display = "none";
                }, 600);
                if (state.currentCol === 4) {
                    const currentWord = getCurrentWord();
                    state.currentRow++;
                    state.currentCol = 0;
                    reveal(currentWord);
                }
                else{
                    alert("You must complete your word");
                }

            } else {
                setTimeout(() => {
                    document.getElementById("char").textContent = key;
                    document.getElementById("char").style.display = "flex";
                }, 20);
                setTimeout(() => {
                    document.getElementById("char").style.display = "none";
                }, 600);
            }




            if (isLetter(key)) {
                addLetter(key);
            }
            updateGrid();
        }

    }
    function getCurrentWord() {
        return state.grid[state.currentRow].reduce((first, last) => first + last);
    }


    function reveal(guessWord) {
        const row = state.currentRow;
        for (let i = 0; i < 4; i++) {
            let letter = guessWord[i];
            const smallBlock = document.getElementById(4 * (row - 1) + i);

            if (letter.toUpperCase() === wordle[i]) {
                smallBlock.classList.add('right');
            }
            else if (wordle.includes(letter.toUpperCase())) {
                smallBlock.classList.add('wrong');
            }
            else {
                smallBlock.classList.add('dontHave');
            }
        }
        const isWinner = wordle == guessWord.toUpperCase();
        const isGameOver = state.currentRow === 4;
        if (isWinner) {
            alert("Congrats");
            document.getElementById("hintbutton").disabled = true;

            deleteGrid();
            const winimag = document.createElement("img");
            if(document.getElementById("hint_content")){
                document.getElementById("hint_content").classList.add("hidden");
            }
            winimag.setAttribute("src", "https://i.imgur.com/5rSjGHJ.gif");
            winimag.setAttribute("id", "img1");
            winimag.classList.add("img");
            document.getElementById("second_container").appendChild(winimag);
            let wordMissed=document.getElementById("word");
            wordMissed.classList.remove("hidden");
            wordMissed.style.backgroundColor="#ffe4c4";
            wordMissed.innerText="You guess the word " + wordle+" correctly";

            

        }
        else if (isGameOver) {
            alert("Loser");
            deleteGrid();
            const loser = document.createElement("img");
            document.getElementById("hintbutton").disabled = true;
            if(document.getElementById("hint_content")){
                document.getElementById("hint_content").classList.add("hidden");
            }
            loser.setAttribute("src", "https://i.imgur.com/9mymd4T.gif");
            loser.setAttribute("id", "img2");
            loser.classList.add("img");
            document.getElementById("second_container").appendChild(loser);
            let wordMissed=document.getElementById("word");
            wordMissed.classList.remove("hidden");
            wordMissed.style.backgroundColor="#Bf4b28";
            wordMissed.innerText="The word you missed is " + wordle;
        }



    }
    function startover() {
        if(document.getElementById("hint_content")){
            document.getElementById("hint_content").classList.add("hidden");}
        document.getElementById("hintbutton").disabled = false;
        if(document.getElementById("word")){
            let word =document.getElementById("word")
            word.style.backgroundColor="var(--primary-color)";
            word.innerText="";
        }
        document.getElementById("startOver").blur();
        if (document.getElementById('img1')) {
            let imgage1 = document.getElementById('img1');
            imgage1.remove();
        }
        else if (document.getElementById('img2')) {
            let imgage2 = document.getElementById('img2');
            imgage2.remove();

        }
        else { }

        var block = document.getElementById("board");
        block.classList.remove("hidden");
        for (let index = 0; index < 16; index++) {
            var smallblock = document.getElementById(index);
            smallblock.classList.remove("hidden");
        }
        state.grid = Array(4)
            .fill()
            .map(() => Array(4).fill(''));
        for (let index = 0; index < 16; index++) {
            var smallBlock = document.getElementById(index);
            smallBlock.classList.remove('right', 'wrong', 'dontHave');
            smallBlock.innerText = "";
        }
        state.currentRow = 0;
        state.currentCol = 0;
        document.getElementById("hint_content").innerText = "";

        updateGrid();
        getWord(false);
    }
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    function isLetter(key) {
        return key.length === 1 && alphabet.includes(key);
    }
    function addLetter(letter) {
        if (state.currentCol === 4) return;
        state.grid[state.currentRow][state.currentCol] = letter.toUpperCase();
        state.currentCol++;

    }
    function removeLetter() {
        if (state.currentCol === 0) return;
        state.grid[state.currentRow][state.currentCol - 1] = '';
        state.currentCol--;
    }
    function deleteGrid() {
        const grid = document.getElementById('board');
        grid.classList.add("hidden");
        for (let index = 0; index < 16; index++) {
            var smallblock = document.getElementById(index);
            smallblock.classList.add("hidden");
            const instructions = document.getElementById("instructions");
            const instructbut = document.getElementById("instructbut");
            instructions.classList.add("hidden");

        }
    }

    function startup() {

        registerKeyboardEvents();

    }
    startup();
})

