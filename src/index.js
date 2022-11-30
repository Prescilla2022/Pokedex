const app = document.getElementById("app");

//Creating the nav bar
app.innerHTML = `<nav id="navBar">
<button id="button-prev">⬅️</button>
<button id="button-home">POKE DEX</button>
<button id="button-next">➡️</button>
<input type="text" name="" id="search-text" placeholder="search" />
<button id="search-button">🔍</button>
</nav>`;

//Declaring global variables
let results = [];
let count = 0;
const pokemonDetails = [];

//assigning class and id to main div
const cardsList = document.createElement("div");
cardsList.className = "poke-list";
cardsList.id = "poke-list";

const btnHome = document.getElementById("button-home");
const btnNext = document.getElementById("button-next");
const btnPrev = document.getElementById("button-prev");
const searchtext = document.getElementById("search-text");
const searchbutton = document.getElementById("search-button");

//Assigning eventlisteners
//searchtext.addEventListener("input", searchPokemons);
searchbutton.addEventListener("click", searchPokemons);
btnPrev.addEventListener("click", previousPage);
btnNext.addEventListener("click", nextPage);
btnHome.addEventListener("click", homePage);

//function when previous button clicked
async function previousPage() {
  cardsList.textContent = null;
  count = Math.floor(count / 20) * 20;
  if (urls.prev === null) {
    urls.prev = `https://pokeapi.co/api/v2/pokemon/?offset=${count}&limit=20`;
  }
  displayData(urls.prev);
}
//function when next button clicked
function nextPage() {
  cardsList.textContent = null;
  displayData(urls.next);
}

function homePage() {
  cardsList.textContent = null;
  displayData(urls.pokedex);
}

//function when text entered in input field
async function searchPokemons() {
  const searchText = searchtext.value;
  const filteredurls = [];
  const allPokemons = await getData(
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1154"
  );
  const searchResults = allPokemons.results.filter((result) => {
    return result.name.includes(searchText);
  });
  searchResults.forEach((result) => {
    const url = getData(result.url);
    filteredurls.push(url);
  });
  cardsList.textContent = null;
  createcard(await Promise.all(filteredurls));
}

//Storing urls
let urls = {
  pokedex: "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20",
  prev: null,
  next: null,
  img: null
};

//function to get the data from Api
async function getData(url) {
  const promise = await fetch(url);
  const data = await promise.json();
  return data;
}

//const pokemons = [];

//function which awaits for api result
async function displayData(url) {
  const fetcheddata = await getData(url);
  setData(fetcheddata);
  const pokemons = [];
  fetcheddata.results.forEach((data) => {
    const info = getData(data.url);
    pokemons.push(info);
  });
  const pokemondetails = await Promise.all(pokemons);
  pokemonDetails.push(...pokemondetails);
  createcard(pokemondetails);
}

//function to set the data
function setData(data) {
  urls.prev = data.previous;
  urls.next = data.next;
  count = data.count;
  results = data.results;
}
//Fuction to create card
async function createcard(details) {
  details.forEach((info) => {
    console.log(info);
    const card = document.createElement("div");
    const heading = document.createElement("h2");
    const image = document.createElement("img");
    heading.textContent = info.name;
    let imgUrl = null;
    imgUrl = info.sprites.other["official-artwork"].front_default;
    image.src = imgUrl;
    card.className = "card";
    card.append(image);
    card.append(heading);
    card.addEventListener("mouseover", () => createPokemonDetails(info, card));
    card.addEventListener("mouseout", () => pokemonCard(info, card));
    cardsList.append(card);
  });
  app.append(cardsList);
}
//function for mousedown
function pokemonCard(info, card) {
  card.innerHTML = `<div class="card" >
  <img src=${info.sprites.other["official-artwork"].front_default}>
    <h2>${info.name}</h2>
   </div>`;
}
//function for mouseover
function createPokemonDetails(info, card) {
  console.log("hi");
  card.innerHTML = `<div class="cardDetails" >
  <h2>${info.name}</h2>
  <h4>Id:${info.id}<h4>
  <h4>BaseExp:${info.base_experience}</h4>
  <h4>Order:${info.order}</h4>
  <h4>Height:${info.height}</h4>
  <h4>Weight:${info.weight}</h4>
   </div>`;
}
//call the initial Api
displayData(urls.pokedex);
