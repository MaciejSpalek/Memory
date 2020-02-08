const $gameSection = $('.game');
const $startSection = $('.start');
const $endSection = $('.end');
const $startButton = $('.start__button')
const $board = $('.board')
const $scoreLabel = $('.start__best-score');

const randomArray = [];
const square = [];
const photo = [
    "1.jpg", "11.jpg",
    "2.jpg", "21.jpg",
    "3.jpg", "31.jpg",
    "4.jpg", "41.jpg",
    "5.jpg", "51.jpg",
    "6.png", "61.png",
    "7.gif", "71.gif",
    "8.jpg", "81.jpg",
]

const hideDuration = 5000;
let hideSquaresTimeOut;
let firstShot = '';
let firstElement;
let secondShot = '';
let secondElement;

let bestScore = 0;
let matches = 0;
let clickCounter = 0;
let isFirstAttempt = true;
let startTime;

function addSquare(array, index) {
    array[index] = $("<div>").addClass('board__square').data({
        'compare-id': setCompareID(photo[randomArray[index]]),
        'id': index
    });
    const front = $("<div>").addClass('board__front-square front--transform').html("?");
    const back = $("<div>").addClass('board__back-square back--transform').css('background-image', `url(image/${photo[randomArray[index]]})`);

    $($board).append(array[index]);
    $(array[index]).append(front);
    $(array[index]).append(back);
}
function createBoard(array, amount) {
    for(let i=0; i<amount; i++) {
        addSquare(array, i);
    }
}
function drawNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function addRandomNumberToArray() {
    const randomNumber = drawNumber(0, 15)
    for (let i = 0; i < randomArray.length; i++) {
        if (randomNumber === randomArray[i]) {
            return addRandomNumberToArray();
        }
    }
    randomArray.push(randomNumber);
}
function drawMoreNumbers() {
    for (let i = 0; i < 16; i++) {
        addRandomNumberToArray()
    }
}
function hideElement(element, isHide) {
    if(isHide) {
        $(element).find('.board__back-square').removeClass('back--transform')
        $(element).find('.board__front-square').removeClass('front--transform')
    } else {
        $(element).find('.board__back-square').addClass('back--transform')
        $(element).find('.board__front-square').addClass('front--transform')
    }
    
}
function removeElement(element) {
    $(element).animate({
        opacity: 0
    }, 1000);
    $(element).css('visibility', 'hidden');
}
function clearRandomArray() {
    randomArray.length = 0;
}
function saveBestScore() {
    localStorage.setItem('bestScore', JSON.stringify(bestScore));
}
function getBestScore() {
    bestScore = JSON.parse(localStorage.getItem('bestScore'));
    if (!bestScore) {
        bestScore = 0;
    }
}
function saveFirstAttempt() {
    localStorage.setItem('isFirstAttempt', JSON.stringify(isFirstAttempt));
}
function getFirstAttempt() {
    isFirstAttempt = JSON.parse(localStorage.getItem('isFirstAttempt'));
    if (isFirstAttempt == null) {
        isFirstAttempt = true;
    }
}
function cardsEvents() {
    $('.board__square').each((index, element) => {
            $(element).on('click', ()=> {
                clickCounter++;
                if(clickCounter <= 2) {
                    hideElement(element, false);
                }

                if(clickCounter == 1) {
                    firstElement = $(element);
                    firstShot = $(element).data('compare-id');
                } 
                
                else if(clickCounter == 2) {
                    secondElement = $(element);
                    secondShot = $(element).data('compare-id');
                    if ($(firstElement).data('id') == $(secondElement).data('id')) {
                        clickCounter = 1;
                    }
                    else if(firstShot == secondShot) { // turn on animation and remove cards
                        setTimeout(()=>{
                            removeElement(firstElement);
                            removeElement(secondElement);
                            clickCounter = 0;
                            matches++;
                            if(matches == 8) {
                                gameOver();
                            }
                        }, 200)
                        
                    } else {
                        setTimeout(()=>{
                            hideElement(firstElement, true);
                            hideElement(secondElement, true);
                            clickCounter = 0;
                        }, 1000)
                    }
                }
            })
    })
}
function removeAllSquares() {
    $('.board__square').each((index, element)=> {
        $(element).remove();
    })
}
function setCompareID(photo) {
    return photo.substring(0, 1);
}
function hideSquare() {
    $('.board__square').each((index, element)=> {
        $(element).find('.board__front-square').removeClass('front--transform');
        $(element).find('.board__back-square').removeClass('back--transform')
    })
}
function startButton() {
    $($startButton).click(() => {
        $($gameSection).show(1000);
        hideSquaresTimeOut = setTimeout(()=> {
            hideSquare();
            cardsEvents();
            startTime = new Date().getTime();
        }, hideDuration)
    })
}
function roundNumber(number, decimalPlaces) {
    let factor = Math.pow(10, decimalPlaces);
    return Math.round(number*factor)/factor;
}
function gameOver() {
    gameOverAnimation();
    setTimeout(()=> {
        $($gameSection).fadeOut(0);
        $($endSection).fadeOut(0);
        removeAllSquares()
        clearRandomArray();
        drawMoreNumbers(); 
        createBoard(square, 16);
        matches = 0;
    }, 2000)
}
function gameOverAnimation() {
    $($endSection).fadeIn(1000);
    const endTime = new Date().getTime();
    const gameTime = roundNumber((endTime-startTime)/1000, 2);
    
    if(isFirstAttempt) {
        bestScore = gameTime;
        isFirstAttempt = false;
        saveFirstAttempt();
        saveBestScore();
    } 
    if(!isFirstAttempt && gameTime < bestScore){
        bestScore = gameTime;
        saveBestScore();
    }

    $($scoreLabel).html(`Best score: ${bestScore}s`)
    $('.end__score').text(`${gameTime}s`)
}

$($gameSection).fadeOut(0);
$($endSection).fadeOut(0);
getBestScore();
getFirstAttempt();
if(!isFirstAttempt) $($scoreLabel).html(`Best score: ${bestScore}s`);
drawMoreNumbers();
createBoard(square, 16);
startButton();















