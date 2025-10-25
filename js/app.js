// dataset 
const flashcards = [
    { front: "HTML", back: "HyperText Markup Language" },
    { front: "CSS", back: "Cascading Style Sheets" },
    { front: "JavaScript", back: "Programming language for web interactivity" },
    { front: "DOM", back: "Document Object Model" },
    { front: "API", back: "Application Programming Interface" },
    { front: "JSON", back: "JavaScript Object Notation" },
    { front: "AJAX", back: "Asynchronous JavaScript and XML" },
    { front: "Node", back: "Each element within the HTML document" },
    { front: "NodeList", back: "Collection of nodes, operates like an array" },
    { front: "Event Handler", back: "Function that responds to user interactions" },
    { front: "addEventListener", back: "Method to register event handlers" },
    { front: "querySelector", back: "Selects first element matching CSS selector" },
    { front: "createElement", back: "Creates a new HTML element node" },
    { front: "appendChild", back: "Adds a new child node to the end" },
    { front: "preventDefault", back: "Stops default behavior of an event" },
    { front: "Event Bubbling", back: "Events propagate from target to ancestors" },
    { front: "Event Delegation", back: "Single listener on parent handles child events" },
    { front: "DOMContentLoaded", back: "Fires when HTML is completely parsed" },
    { front: "classList", back: "Read-only list of CSS classes on element" },
    { front: "textContent", back: "Text content of node stripped of tags" },
    { front: "innerHTML", back: "HTML content inside an element" },
    { front: "Flexbox", back: "CSS layout module for flexible containers" },
    { front: "Grid", back: "CSS layout system for 2D grid-based layouts" },
    { front: "Responsive Design", back: "Web design that adapts to screen size" }
];

// memory pairs 
const memoryPairs = [
    { id: 1, text: "HTML" },
    { id: 1, text: "Markup Language" },
    { id: 2, text: "CSS" },
    { id: 2, text: "Style Sheets" },
    { id: 3, text: "JavaScript" },
    { id: 3, text: "Interactivity" },
    { id: 4, text: "DOM" },
    { id: 4, text: "Document Model" },
    { id: 5, text: "API" },
    { id: 5, text: "Interface" },
    { id: 6, text: "JSON" },
    { id: 6, text: "Data Format" }
];

// flashcards 
let currentCardIndex = 0;
let gotItCount = 0;
let isFlipped = false;

// memory 
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

// DOM 
const flashcardsBtn = document.getElementById('flashcards-btn');
const memoryBtn = document.getElementById('memory-btn');
const flashcardsMode = document.getElementById('flashcards-mode');
const memoryMode = document.getElementById('memory-mode');
const flashcard = document.getElementById('flashcard');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const flipBtn = document.getElementById('flip-btn');
const gotItBtn = document.getElementById('got-it-btn');
const againBtn = document.getElementById('again-btn');
const progressEl = document.getElementById('progress');
const gotItCountEl = document.getElementById('got-it-count');
const memoryGrid = document.getElementById('memory-grid');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const winMessage = document.getElementById('win-message');
const resetBtn = document.getElementById('reset-btn');
const matchStatus = document.getElementById('match-status');


// toggel mode

flashcardsBtn.addEventListener('click', () => switchMode('flashcards'));
memoryBtn.addEventListener('click', () => switchMode('memory'));

function switchMode(mode) {
    if (mode === 'flashcards') {
        flashcardsMode.classList.add('active');
        memoryMode.classList.remove('active');
        flashcardsBtn.classList.add('active');
        memoryBtn.classList.remove('active');
    } else {
        flashcardsMode.classList.remove('active');
        memoryMode.classList.add('active');
        flashcardsBtn.classList.remove('active');
        memoryBtn.classList.add('active');
        initMemoryGame();
    }
}


// FLASHCARDS MODE


//  card content
function updateCard() {
    const card = flashcards[currentCardIndex];
    cardFront.textContent = card.front;
    cardBack.textContent = card.back;
    isFlipped = false;
    flashcard.classList.remove('flipped');
    
    // got it and again buttons until card is flipped
    gotItBtn.disabled = true;
    againBtn.disabled = true;
    
    updateProgress();
}

// progress display
function updateProgress() {
    progressEl.textContent = `${currentCardIndex + 1}/${flashcards.length}`;
    gotItCountEl.textContent = gotItCount;
}

// flip 
function flipCard() {
    isFlipped = !isFlipped;
    flashcard.classList.toggle('flipped');
    
    // Enable Got It and Again buttons after flipping
    if (isFlipped) {
        gotItBtn.disabled = false;
        againBtn.disabled = false;
    } else {
        gotItBtn.disabled = true;
        againBtn.disabled = true;
    }
}

// next card
function nextCard() {
    if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
    } else {
        currentCardIndex = 0;
    }
    updateCard();
}

// listeners flashcards
flipBtn.addEventListener('click', flipCard);
flashcard.addEventListener('click', flipCard);

gotItBtn.addEventListener('click', () => {
    if (isFlipped) {
        gotItCount++;
        nextCard();
    }
});

againBtn.addEventListener('click', () => {
    if (isFlipped) {
        nextCard();
    }
});

// keyboard support for flashcards
flashcard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flipCard();
    }
});

// keyboard navigation
document.addEventListener('keydown', (e) => {
    if (flashcardsMode.classList.contains('active')) {
        if (e.key === 'ArrowRight' && isFlipped) {
            againBtn.click();
        } else if (e.key === 'ArrowLeft' && currentCardIndex > 0 && isFlipped) {
            currentCardIndex--;
            updateCard();
        }
    }
});


// MEMORY MATCH 

// shuffle utility
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// memory game
function initMemoryGame() {
    memoryCards = shuffleArray(memoryPairs);
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    canFlip = true;
    movesEl.textContent = moves;
    matchesEl.textContent = `0/${memoryPairs.length / 2}`;
    winMessage.textContent = '';
    renderMemoryGrid();
}

//  memory grid
function renderMemoryGrid() {
    memoryGrid.innerHTML = '';
    
    memoryCards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card';
        cardEl.tabIndex = 0;
        cardEl.setAttribute('role', 'button');
        cardEl.setAttribute('aria-label', `Card ${index + 1}`);
        cardEl.dataset.index = index;
        cardEl.dataset.id = card.id;

        const innerDiv = document.createElement('div');
        innerDiv.className = 'memory-card-inner';

        const frontDiv = document.createElement('div');
        frontDiv.className = 'memory-card-face memory-card-front';
        frontDiv.textContent = '?';

        const backDiv = document.createElement('div');
        backDiv.className = 'memory-card-face memory-card-back';
        backDiv.textContent = card.text;

        innerDiv.appendChild(frontDiv);
        innerDiv.appendChild(backDiv);
        cardEl.appendChild(innerDiv);
        memoryGrid.appendChild(cardEl);
    });
}

//  memory Grid
memoryGrid.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.memory-card');
    if (cardEl) {
        handleCardClick(cardEl);
    }
});

memoryGrid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const cardEl = e.target.closest('.memory-card');
        if (cardEl) {
            e.preventDefault();
            handleCardClick(cardEl);
        }
    }
});

// handle click
function handleCardClick(cardEl) {
    // Guardrails: prevent invalid clicks
    if (!canFlip) return;
    if (cardEl.classList.contains('flipped')) return;
    if (cardEl.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    const index = parseInt(cardEl.dataset.index);
    const id = parseInt(cardEl.dataset.id);

    cardEl.classList.add('flipped');
    flippedCards.push({ element: cardEl, index, id });

    if (flippedCards.length === 2) {
        moves++;
        movesEl.textContent = moves;
        checkMatch();
    }
}

// check match
function checkMatch() {
    canFlip = false;
    const [card1, card2] = flippedCards;

    if (card1.id === card2.id) {
        // match 
        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            matchedPairs++;
            matchesEl.textContent = `${matchedPairs}/${memoryPairs.length / 2}`;
            matchStatus.textContent = 'Match found!';
            flippedCards = [];
            canFlip = true;

            // win condition
            if (matchedPairs === memoryPairs.length / 2) {
                setTimeout(() => {
                    winMessage.textContent = `🎉 YOU WIN! Completed in ${moves} moves! 🎉`;
                }, 500);
            }
        }, 500);
    } else {
        // no match
        matchStatus.textContent = 'No match. Try again.';
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

// reset 
resetBtn.addEventListener('click', initMemoryGame);

// begin
updateCard();
