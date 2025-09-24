const dataContainer = document.getElementById('data-container');
const fetchBtn = document.getElementById('fetch-btn');
const axiosBtn = document.getElementById('axios-btn');

const POKE_LIST_URL = 'https://pokeapi.co/api/v2/pokemon?limit=6';


const PLACEHOLDER = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

// Mostrar tarjetas
function displayCards(items) {
  dataContainer.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = item.image || PLACEHOLDER;
    img.alt = item.name;
    img.onerror = () => { img.src = PLACEHOLDER; };

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = item.name;

    card.appendChild(img);
    card.appendChild(name);
    dataContainer.appendChild(card);
  });
}

// Obtener detalle de Pokémon
async function getPokemonDetails(url) {
  const res = await fetch(url);
  const data = await res.json();
  const art = data.sprites?.other?.['official-artwork']?.front_default;
  return {
    name: data.name,
    image: art || data.sprites?.front_default || PLACEHOLDER
  };
}

// Personajes oficiales principales de pokemon 
const cartoonCharacters = [
  { name: "Pikachu", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png" },
  { name: "Meowth", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/052.png" },
];

// FETCH
async function getWithFetch() {
  try {
    const r = await fetch(POKE_LIST_URL);
    const json = await r.json();
    const pokemons = await Promise.all(json.results.map(p => getPokemonDetails(p.url)));
    displayCards([...cartoonCharacters, ...pokemons]);
  } catch (err) {
    console.error("Error con Fetch:", err);
    displayCards([{ name: "Error", image: PLACEHOLDER }]);
  }
}

// AXIOS
async function getWithAxios() {
  try {
    const r = await axios.get(POKE_LIST_URL);
    const results = r.data.results;
    const pokemons = await Promise.all(results.map(async p => {
      const res = await axios.get(p.url);
      const data = res.data;
      const art = data.sprites?.other?.['official-artwork']?.front_default;
      return { name: data.name, image: art || data.sprites?.front_default || PLACEHOLDER };
    }));
    displayCards([...cartoonCharacters, ...pokemons]);
  } catch (err) {
    console.error("Error con Axios:", err);
    displayCards([{ name: "Error", image: PLACEHOLDER }]);
  }
}

// Eventos
fetchBtn.addEventListener('click', getWithFetch);
axiosBtn.addEventListener('click', getWithAxios);

