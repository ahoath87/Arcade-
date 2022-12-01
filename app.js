//********* State *********
let state = {};

const resetState = () => {
    state.board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];
    state.winner = null;
    state.getCurrentPlayer = () => state.players[state.currentPlayerIdx];
    state.players = ['', ''];
    state.currentPlayerIdx = 0;
    state.lastSelectedIDx = -1;
}; 




//********* Dom Selectors *********
// pulling elements from the html 
const boardElem = document.querySelector('#board');
const playerTurnElem =document.querySelector('#player-turn');
// had to make tbl a global variable in order to manipulate it in multiple functions
const tbl = document.createElement('table');


//counter if player puts in an X or an O
let count = 0;
let countx = 0;
let counto = 0;


//********* Game Logic Helper Functions *********

//Here we determine X and O players 
function playGame (event, index){  
   if(count % 2 == 0){
    event.target.innerHTML = "X";
    updateBoard("X", index);
    } else {
    event.target.innerHTML = "O";
    updateBoard("O", index);
    }
   count++;
 // console.log(state);
  
};
   
   
function changeTurn(){
    // turns switch between players
    state.lastturnedIdx = -1;
    state.currentPlayerIdx = Math.abs(state.currentPlayerIdx-1);
}


function checkForWin (event) {
    // evaluates for a winner based on having either 3 in a row, column or diagonal of X's or O's
    winner = 'false';
    countall = 0;
    // first loop checks rows and columns for win condition
    for (i = 0; i < 3; i++){
        countx = 0;
        counto = 0;
        countxcol = 0;
        countocol = 0;
        countRdiag = 0;
// 'i' iterates through the row then 'j' iterates through each column of that row before returing to the above for loop
       for (j = 0; j < 3; j++){
            //if(state.board[i][j] === 'string'){  
               // console.log("state.board[i][j]", state.board[i][j])             
            if (state.board[i][j]  == 'X'){
                countx++ } 
            if (countx == 3) {
                state.winner = state.getCurrentPlayer();
                console.log ('X wins!')}
            if (state.board[i][j] == 'O'){
                counto++ } 
            if ( counto === 3) {
                state.winner = state.getCurrentPlayer();
                console.log ('O wins!')}
            if (state.board[j][i] == 'X'){
                countxcol++ }
            if (countxcol === 3) {
                state.winner = state.getCurrentPlayer();
                console.log ('X wins!') }
            if (state.board[j][i] == 'O'){
                countocol++ }
            if (countocol === 3) {
                state.winner = state.getCurrentPlayer();
                console.log ('O wins!') }
            }
        } 
        countRdiagx = 0;
        countRdiago = 0;
        countLdiagx = 0;
        countLdiago = 0;
        x = 0;
    // second loop checks the diagonal for win condition
    for (i = 0; i < 3; i++){
        for (j = 0; j < 3; j++){
            if (i == j){
              //  console.log(i, j, countRdiagx)
                if (state.board[i][j]  == 'X'){
                    countRdiagx++ } 
                if (countRdiagx === 3) {
                    state.winner = state.getCurrentPlayer();
                    console.log ('X wins!')}
                if (state.board[i][j]  == 'O'){
                     countRdiago++ } 
                if (countRdiago === 3) {
                    state.winner = state.getCurrentPlayer();
                    console.log ('O wins!')}
                }
    // to iterate on the right to left diagonal I had to identify those indices through the x variable 
    // identified all even numbers except for 8 and zero
    // my CSS flex box made the tds run in columns rather than rows so 
    // array map looks like this    [0, 3, 6], from the below renderBoard and updateBoard functions
                                //  [1, 4, 7]
                                //  [2, 5, 8]
    
            x = i + 3 * j;
            if (x % 2 == 0 && x < 8 && x > 0) {
                if (state.board[i][j]  == 'X'){
                    countLdiagx++ } 
                if (countLdiagx === 3) {
                    state.winner = state.getCurrentPlayer();
                    console.log ('X wins!')}
                if (state.board[i][j]  == 'O'){
                     countLdiago++ } 
                if (countLdiago === 3) {
                    state.winner = state.getCurrentPlayer();
                    console.log ('O wins!')}
            }
// adds to the count on the overall board to determine tie
            if (state.board[i][j] == 'X' || state.board[i][j] =='O'){
                countall++;
            } 
        }
    }
    // uses box count and a boolean to determine a tie
    if (countall == 9 && winner == 'false'){
        //console.log('No one');
        state.winner = 'You are both terrible.... no one';
    }
}
     


//********* Dom Manipulation Functions *********

// creates the board at the start of the game
function renderBoard() {
 // takes global created element table and adds 3 rows (td) and 3 cells per row (tr)>   
    if (!state.players[0] || !state.players[1]){
         k = 0; 
        for (i = 0; i < 3; i++) {
            const row = document.createElement("tr");
            for (j = 0; j < 3; j++) {
                const cellElem = document.createElement("td");
                row.appendChild(cellElem);
                cellElem.classList.add('cell');
 //assigned a number per cell to map out our board
                cellElem.dataset.index = [k];   
                k++;
            }
            tbl.appendChild(row);
        }
        boardElem.appendChild(tbl);
   }
};


// this links state.board with the number assigned to each cell from renderBoard
// mapping of the array looks like this  [0, 3, 6]
                            //           [1, 4, 7]
                            //           [2, 5, 8]
function updateBoard(value, index) {
    x = 0;
    //console.log(value, index);
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            x = i*3+j;
            if(index == x){
             state.board[j][i] = value;
            }
        }
    }
 };


// renders the player dive below the grid
const renderPlayer = () => {
  let text;
  if (!state.players[0] || !state.players[1]) {
    text = `
    <input name="player1" placeholder="Enter Player 1">
    <input name="player2" placeholder="Enter Player 2">
    <button class="start">Start Game</button>
    `;
  
} else {
    if (state.winner) {
        text = `<span class = 'player'>${state.winner} has won!</span>`;
    } else {
        text = `It's currently <span class='player'>${state.getCurrentPlayer()}</span>'s turn.`;
    }
  }
  playerTurnElem.innerHTML = text;
  // creates the resetButton element and changes it to 'Play Again'
  if(state.winner) {
    const resetButton = document.createElement('button')
    resetButton.innerHTML =`Play Again!`
    resetButton.classList.add('restart');
    playerTurnElem.appendChild(resetButton);
  }
};


// combines render board and player into single function render
const render = () => {
    renderBoard();
   // console.log(state.board);
    renderPlayer();
};
  
    


//********* Event Listeners *********


//what happens on each click off a cell in the grid
boardElem.addEventListener("click", (event) => {
    if (!state.players[0] || !state.players[1]) return;
    if (event.target.className !== 'cell') return;
    if (event.target.innerHTML == "X" || event.target.innerHTML == 'O') return;
    if (state.winner) return;
 //get the map value k that was set in renderboard for corresponding cell   
const cellIdx = event.target.dataset.index; 
//console.dir(cellIdx);
//console.log("cellIdx", cellIdx);
// calls all functions that need to ocure on a turn
playGame(event, cellIdx);
checkForWin();
changeTurn();
renderPlayer();
});



playerTurnElem.addEventListener('click', (event) => {
    if (event.target.className === 'restart') {
       //have to clear X and Os 
       // console.log("tabel", tbl);
        tbl.innerHTML = ' ';

// make sure to return to original state and render boar/players
        resetState();
        render();
              
    } else if (event.target.className === 'start') {
      // get the input of player1
      const player1Input = document.querySelector('input[name=player1]');
      // get the value from the input
      const player1Value = player1Input.value;
      state.players[0] = player1Value;
      //  Do the same thing for player2
      const player2Input = document.querySelector('input[name=player2]');
      // get the value from the input
      const player2Value = player2Input.value;
      state.players[1] = player2Value;
      renderPlayer()
    }
  });
  




//********* BootStrapping *********
resetState();
render();