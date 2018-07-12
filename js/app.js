/*
 * VARIABLES
 */

const cards = ['fa fa-diamond',
             'fa fa-paper-plane-o',
             'fa fa-anchor',
             'fa fa-bolt',
             'fa fa-cube',
             'fa fa-leaf',
             'fa fa-bicycle',
             'fa fa-bomb'];

const allCards = cards.concat(cards);

let isfirstFlip = true;

let openCards = [];

//variables for timer

let hours = 0;
let minutes = 0;
let seconds = 0;
const timer = document.querySelector('.timer');

// variables for statistic

let stars = 4;
let moves = 0;
let matches = 0;
let timeCount;

const starList = document.querySelector('.stars');
const counter = document.querySelector('.moves');

const finalMoves = document.querySelector('.total-moves');
const finalStars = document.querySelector('.stars-left');
const finalTime = document.querySelector('.time');

// select html content
const deck = document.getElementById('deck');
const restart = document.querySelector('.restart');

// buttons to restart Game

const newGame = document.getElementById('restart');
const winScreen = document.querySelector('.modal-bc');

//start.addEventListener('click', startGame);

restart.addEventListener('click', startGame);

startGame();
// reset all values to default

function resetValues(){

  stopTimer();

  isfirstFlip = true;
  moves = 0;
  stars = 4;
  matches = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  openCards = [];

  timer.innerHTML = 'Time: 00 : 00 : 00';
  deck.innerHTML = '';
  counter.innerHTML = moves;

  starList.innerHTML = '';

  for (let i = 0; i < 4; i++){
    starList.innerHTML += '<li><i class="fa fa-star"></i></li>';
  }

}

// function to start/restar Game

function startGame(){

  resetValues();
  fillDeck();
  clickableCards();

}

// popup window function if player wins the game

function youWon() {

  deck.innerHTML = '';

  finalMoves.innerHTML = `Moves Made: ${moves}`;
  finalStars.innerHTML = `Stars Left: ${stars}`;
  finalTime.innerHTML = timer.innerHTML;

  winScreen.classList.add('visible');
  newGame.addEventListener('click', function(){

    winScreen.classList.remove('visible');
    startGame();

  });
}

/*
* DECK AND CARDS MANIPULATION FUNCTIONS
*/

// Shuffle cards function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// create single card element

function createSingleCard (cardClass) {
  let li = document.createElement('li');
  let i = document.createElement('i');

  li.classList = 'card';
  i.classList = cardClass;
  i.classList.add('icon');

  li.appendChild(i);
  return li;
}

// generate all cards to deck

function fillDeck () {

  shuffle(allCards);

  for (let card of allCards) {
    let newCard = createSingleCard(card);
    deck.appendChild(newCard);
  }
}

// add event listener to all cards if clicked

function clickableCards() {
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('click', function() {

      const currentCard = this;

      if (isfirstFlip) {
          startTimer();
          isfirstFlip = false;
      }

      if (openCards.length < 2 && !currentCard.classList.contains('open')) {

          showCard(currentCard);
          addToList(currentCard);

      }
    });
  });
  }

/*
* PLAYTIME FUNCTIONS
*/

// display card when clicked

function showCard(first) {
  first.classList.add('open');
  first.firstElementChild.classList.add('show');
}

// add card to openCards list

function addToList(first){

  openCards.push(first);

  if (openCards.length === 2) {
    let firstCard = openCards[0].firstElementChild.className;
    let secondCard = openCards[1].firstElementChild.className;

    if (firstCard === secondCard)  {
      itsAMatch(openCards[0], openCards[1]);
    }
    else {
      notAMatch(openCards[0], openCards[1]);
    }
  }
}

// lock matching cards

function itsAMatch(first, last) {
  first.classList.add('match');
  last.classList.add('match');

  matches++;
  openCards = [];

  countMoves();
  checkStars();
  checkMatchCount();
}

// close not matching cards

function notAMatch(first, last){
  first.classList.add('wrong');
  last.classList.add('wrong');

  setTimeout(function(){

    first.classList.remove('wrong', 'open', 'show');
    last.classList.remove('wrong', 'open', 'show');

    first.firstElementChild.classList.remove('show');
    last.firstElementChild.classList.remove('show');
    openCards = [];

  }, 1000);

  countMoves();

}

//counting and updating moves

function countMoves(){
  moves++;
  counter.textContent = moves;
  checkStars();
}

// update Stars if 4, 8, or 12 moves made

function checkStars(){
  if (stars > 1) {
    if (moves === 4 || moves === 8 || moves === 12) {
      starList.removeChild(starList.children[0]);
      stars--;
    }
  }
}

// check count of matched card pairs

function checkMatchCount(){
  if (matches === 8) {
    youWon();
  }
}

/*
* TIMER FUNCTIONS
*
* timer idea from webinar:  FEND: Q&A with Project Coach Ryan Waite
* Ryan answers Project 2: Memory Game questions having to do with the
* counter and time functions and explains how to get started with Project 3: Classic Arcade Game Clone.
* https://youtu.be/h_vUG-vi2LY
*
*/

// set timer

function startTimer() {
  timeCount = setInterval(function(){

    seconds++;

    if(seconds === 60) {
      seconds = 0;
      minutes++;
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
    }

    timer.innerHTML = format();

  }, 1000);
}

// format time output

function format(){
  let sec = seconds > 9 ? String(seconds) : '0' + String(seconds);
  let min = minutes > 9 ? String(minutes) : '0' + String(minutes);
  let hr = hours > 9 ? String(hours) : '0' + String(hours);

  return `Time: ${hr} : ${min} : ${sec}`;
}

// clear interval (stop timer)

function stopTimer(){
  clearInterval(timeCount);
}
