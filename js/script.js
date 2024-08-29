const pokemonName = document.querySelector(".pokemon_name");
const pokemonNumber = document.querySelector(".pokemon_number");
const pokemonImg = document.querySelector(".pokemon_img");

const form = document.querySelector(".form");
const input = document.querySelector(".input_search");

const buttonPrev = document.querySelector(".btn-prev");
const buttonNext = document.querySelector(".btn-next");

// Seleciona o botão pelo ID
const playSoundBtn = document.querySelector('.playSoundBtn');

let searchPokemon = 1;
let audioUrl = "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg";

const fetchPokemon = async (pokemon) => {
    
    if(pokemon == 538){
        pokemon = 'throh'
    }//erro espeífico na leitura do JSON desse pokemon

    const APIresponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (!(APIresponse.ok)) {
        throw new Error('Network response was not ok');
    }else{
        const data = await APIresponse.json();
        return data;
    }
}

const renderPokemon = async (pokemon) => {

    pokemonName.innerHTML = "Loading...";

    const data = await fetchPokemon(pokemon);

    if(data){
        if(data.id <= 809){
            pokemonImg.style.display = 'block';
            pokemonNumber.innerHTML = data.id;
            pokemonName.innerHTML = data.name;
            audioUrl = data.cries.latest;
            if(data.id <= 649){
                pokemonImg.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
            }else if(data.id == 772){
                pokemonImg.src = 'https://projectpokemon.org/images/normal-sprite/typenull.gif';
            }else if(data.id >= 782 && data.id <= 784){
                pokemonImg.src = `https://projectpokemon.org/images/normal-sprite/${data.name.toLowerCase()}.gif`;
            }else if(data.id >= 785 && data.id <= 788){
                let arrayname = data.name.split("-");
                let word = arrayname[0]+arrayname[1];
                pokemonImg.src = `https://projectpokemon.org/images/normal-sprite/${word.toLowerCase()}.gif`
            }else if(data.id <= 809){
                let arrayname = data.name.split("-");
                let word = arrayname[0];
                pokemonImg.src = `https://projectpokemon.org/images/normal-sprite/${word.toLowerCase()}.gif`
            }
            searchPokemon = data.id;
            console.log(data.id);
            console.log(searchPokemon);

        }else{
            pokemonImg.style.display = 'none';
            pokemonNumber.innerHTML = "";
            pokemonName.innerHTML = "Not Found";
        }
        
        input.value = '';

    }else{
        pokemonImg.style.display = 'none';
        pokemonNumber.innerHTML = "";
        pokemonName.innerHTML = "Not Found";
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    renderPokemon(input.value.toLowerCase());

});

buttonPrev.addEventListener('click', () => {
    if(searchPokemon > 1){
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }

});

buttonNext.addEventListener('click', () => {
    if(searchPokemon < 810){
        searchPokemon += 1;
        renderPokemon(searchPokemon);
    }
});


playSoundBtn.addEventListener('click', async () => {
    // Cria um novo objeto de áudio
    const audio = new Audio(audioUrl);
    // Toca o áudio quando o botão é clicado
    await audio.play();
});

renderPokemon(searchPokemon);
