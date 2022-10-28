// --- Objects ---
function Card(id, name, origin, abilities, img){
    this.id = id;
    this.name = name;
    this.origin = origin;
    this.abilities = abilities;
    this.img = img;
}
function Player(name, cards){
    this.name = name;
    this.cards = cards;
}
function saveGame () {
    this.id = 0
    this.players = []        
}

let player1 = new Player;
let player2 = new Player;
player1.cards = []
player2.cards = []

let notChoice = []

//  --- Functions --- 

let assignNewCard = (player)=>{
    while(player.cards[2] == undefined){ 
        //creates random card
        let random = Math.floor(Math.random()*(47-1) + 1);
        let character = data.filter(item => item.id == random);
        let card = new Card(character[0].id, character[0].name, character[0].origin, character[0].abilities.splice(2).toString(), character[0].img_url)
        // assign new card to player and prevents reapeted cards
        if (!notChoice.includes(character[0].id)){
            player.cards.push(card);
            notChoice.push(character[0].id);
        }
    }
}

let showPage = (page)=>{
    document.querySelectorAll('.screen').forEach(page =>{
        page.classList.add('off');
    })
    document.querySelector('.'+page).classList.remove('off') 
}

let reset = ()=>{
    document.querySelector('#player1').value = '';
    document.querySelector('#player2').value = '';
    notChoice = [];
}

let hardReset = ()=>{
    player1 = new Player;
    player2 = new Player;
    player1.cards = []
    player2.cards = []
    document.querySelector('.cardsPlayer1').innerHTML = '';
    document.querySelector('.cardsPlayer2').innerHTML = '';
}

let newGame = document.querySelector('form').addEventListener('submit', (e)=>{ 
    e.preventDefault();
    let player1Name = document.querySelector('#player1').value;
    let player2Name = document.querySelector('#player2').value;
    if (player1Name == '' || player2Name == ''){
        Swal.fire({
            icon: 'error',
            title: 'Insert players!',
            showConfirmButton: false,
            timer: 1500
          })
    }else{
        player1.name = player1Name;
        player2.name = player2Name;
        assignNewCard(player1);
        assignNewCard(player2);
        reset()
        for(i=0; i<3; i++){
            appendCard(player1, i)
        }
        for(i=0; i<3; i++){
            appendCard(player2, i)
        }
        showPage('loading');
        setTimeout(()=>{showPage('view-cards')}, 4000);
    }
})

const carousel =  document.querySelector('.carousel-inner');

let appendCard=(player, i)=>{

    //Creates HTML elements
    const newDiv = document.createElement('div')
    newDiv.classList.add('carousel-item');
    const title = document.createElement('h2')
    title.classList.add('text-center', 'pb-4');
    const img = document.createElement('img');
    img.classList.add('d-block')
    const dataDiv = document.createElement('div')
    dataDiv.classList.add('text-center', 'fw-bold', 'mt-3', 'pb-5');
    const name = document.createElement('p')
    const origin = document.createElement('p')
    const abilities = document.createElement('p')
    abilities.classList.add('text-center')

    //Check 'active' class carousel
    if(i==0 && player==player1){newDiv.classList.add('active')}

    //Set card content
    title.textContent = ('Card '+(i+1)+'/3 '+player.name);
    img.setAttribute('src', player.cards[i].img);
    name.textContent = ('Name: '+player.cards[i].name);
    origin.textContent = ('Origin: '+player.cards[i].origin);
    if (player.cards[i].abilities == ''){
        abilities.textContent = 'Not special abilites :('
    }else {
        abilities.textContent = ('Abilities: '+player.cards[i].abilities);
    }

    //append card elements
    dataDiv.append(name, origin, abilities);
    newDiv.append(title, img, dataDiv);
    carousel.appendChild(newDiv);
}

let showResult = () =>{
    document.querySelector('.resultNamePlayer1').innerHTML = player1.name;
    document.querySelector('.resultNamePlayer2').innerHTML = player2.name;
    //container result cards
    const playerCards1 = document.querySelector('.cardsPlayer1');
    const playerCards2 = document.querySelector('.cardsPlayer2');
    
    let scorePlayer1; 
    let scorePlayer2;
    const winner = document.querySelector('.winner');
    //append card and calculate score
    player1.cards.forEach(card => {
        scorePlayer1 =+ card.id;
        let img = document.createElement('img');
        img.classList.add('cards')
        img.setAttribute('src', card.img);
        playerCards1.appendChild(img)
    })
    player2.cards.forEach(card => {
        scorePlayer2 =+ card.id;
        let img = document.createElement('img');
        img.classList.add('cards')
        img.setAttribute('src', card.img);
        playerCards2.appendChild(img)
    })
    //Declare winner
    if (scorePlayer1 > scorePlayer2) {winner.innerHTML = (player1.name+' WINS')}
    else{winner.innerHTML = (player2.name+' WINS')}
}

let appendSavedCards = ((player1,player2,id)=>{
    lastGames.innerHTML += 
        `<li class="mt-3 last-games-item">
            <div class="row">
                <div class="col-7">
                    <p class="fs-6 fw-bold">${player1} vs ${player2}</p>
                </div>
                <div class="col-5">
                    <button id=${id} class="home--btn-viewsaved">
                        > REVIEW
                    </button>
                </div>
            </div>
        </li>`
})

let save = ()=>{
    // if localStorage data dont exist, create key
    if (!localStorage.getItem('games')){localStorage.setItem('games','[]');}
    let storedGames = JSON.parse(localStorage.getItem('games'));
    // create/get game id
    let lastStored
    try{
        lastStored = storedGames[storedGames.length - 1].id;
    }catch{
        lastStored = 0;
    }
    //saves last game
    let saved = new saveGame;
    saved.id = lastStored + 1;
    saved.players.push(player1)
    saved.players.push(player2)
    storedGames.push(saved);
    localStorage.setItem('games', JSON.stringify(storedGames));
    // append game in UI
    appendSavedCards(player1.name,player2.name,saved.id)
    lastGames.classList.remove('off');
}

let viewSaved = false;

let viewbtn = ()=>{
    btnsViewSaved.forEach(btn =>{
        btn.addEventListener('click', () =>{
            //retrieve stored games
            let storedGames = JSON.parse(localStorage.getItem('games'));
            //create btn with game id
            let id = btn.id
            let game = storedGames.filter(game => game.id == id);
            //retreave game
            player1 = game[0].players[0];
            player2 = game[0].players[1];
            for(i=0; i<3; i++){
                appendCard(player1, i)
            }
            for(i=0; i<3; i++){
                appendCard(player2, i)
            }
            showPage('view-cards')
            viewSaved = true;
        })
    })
}

let lastGames = document.querySelector('.last-games');

let btnViewSaved
let btnsViewSaved


let recoverGames= ()=>{
    document.querySelector('.last-games').classList.remove('off')
    let storedGames = JSON.parse(localStorage.getItem('games'));
    storedGames.forEach(game =>{
        let player1 = game.players[0].name
        let player2 = game.players[1].name
        appendSavedCards(player1,player2,game.id)
    })
    btnViewSaved = document.getElementsByClassName('home--btn-viewsaved');
    btnsViewSaved = Array.from(btnViewSaved);
    viewbtn()
}

// --- check LocalStorage ---

if (localStorage.getItem('games')){
    recoverGames()
}

// --- Buttons --- 

let btnExit = document.querySelector('.view-results--btn-exit').addEventListener('click', ()=>{
    hardReset();
    showPage('home');
})

let btnSave = document.querySelector('.view-results--btn-save').addEventListener('click', ()=>{
    Swal.fire({
        icon: 'success',
        title: 'game Saved!',
        showConfirmButton: false,
        timer: 1500
    })
    setTimeout(()=>{
        save();
        hardReset();
        btnViewSaved = document.getElementsByClassName('home--btn-viewsaved');
        btnsViewSaved = Array.from(btnViewSaved);
        viewbtn()
        showPage('home');
    },1500) 
})

let btnCloseViewCards = document.querySelector('.view-cards--btn-close').addEventListener('click', ()=>{
    document.querySelector('.carousel-inner').innerHTML = ''
    if (viewSaved == true){
        showResult()
        showPage('view-results')
        document.querySelector('.view-results--btn-save').classList.add('off');
        viewSaved = false
    }else{
        showPage('popup')
        document.querySelector('.view-results--btn-save').classList.remove('off');
    }
})

let btnViewResults = document.querySelector('.popup--btn-results').addEventListener('click', ()=>{
    showResult()
    showPage('view-results');

})

let btnThrowAgain = document.querySelector('.popup--btn-throw').addEventListener('click', ()=>{
    hardReset();
    showPage('home');
})
