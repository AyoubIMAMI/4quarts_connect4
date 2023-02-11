import {colorMessage,checkWin,printIllegalMove, toTab} from "../gameManagement.js"

var randNum =  Math.floor(Math.random() * 10) + 1;
let gameOver = false;
document.addEventListener('DOMContentLoaded', init);
var socket = io();
let counter = 0;

socket.on('connect',function(){
    socket.emit('joinRoom', randNum);
})
socket.on('updateRoom',function(id){
    console.log(id);
    console.log(randNum);
})
socket.on('doMove',function(pos){
    startplay(JSON.parse(pos));
    counter++;
    colorMessage(counter);
})

function init() {
    window.addEventListener("load", function (){colorMessage(counter);})
    document.getElementById("grid").addEventListener("click", function(event){play(event)});
    document.getElementById("saveButton").addEventListener('click', saveGame);
}

function play(event) {
    let id = event.target.id;
    let tab = id.split(" ");
    startplay(tab,false);
    colorMessage(counter);
    socket.emit('play',JSON.stringify({
        id:randNum,
        board:toTab()}));
    counter++;
}

function startplay(tab){
    if (counter === 42) {
        console.log("Draw!");
        document.getElementById("message").innerText = "Draw!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        gameOver = true;
    }
    if (gameOver) return;
    let color = 'red';
    if (counter % 2 === 0) color = 'yellow';

    let column = tab[0];
    let line = 5;

    let id = column + " " + line;

    if (document.getElementById(id).style.backgroundColor !== "")
        return printIllegalMove();

    while (line >=0 && document.getElementById(id).style.backgroundColor === "") {
        line--;
        id = column + " " + line;
    }
    console.log(counter);

    line++;
    id = column + " " + line;
    document.getElementById(id).style.backgroundColor = color;
    if (checkWin() === true) {
        console.log(color + " player wins!");
        document.getElementById("message").innerText = color + " player wins!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        gameOver = true;
    }

}

function resetGame() {
    gameOver = false;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            let id = j + " " + i;
            document.getElementById(id).style.backgroundColor = "";
        }
    }
    counter = 0;
    document.getElementById("message").innerText = "";
    document.getElementById("reset-button").style.display = "none";
}

function saveGame() {
    console.log("in saveGame")
    const tab = {
        gameType: "bot",
        tab: toTab()
    };
    console.log(tab)
    fetch('http://localhost:8000/api/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tab)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
}
