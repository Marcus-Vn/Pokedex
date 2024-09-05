const pokemonName = document.querySelector(".pokemon_name");
const pokemonNumber = document.querySelector(".pokemon_number");
const pokemonImg = document.querySelector(".pokemon_img");
const pokemonType = document.querySelector(".pokemon_type");
const pokemonStat = document.querySelector(".stats");

const form = document.querySelector(".form");
const input = document.querySelector(".input_search");

const buttonPrev = document.querySelector(".btn-prev");
const buttonNext = document.querySelector(".btn-next");

// Seleciona o botão pelo ID
const playSoundBtn = document.querySelector('.playSoundBtn');

document.addEventListener("DOMContentLoaded", function() {
    const pokedexImage = document.querySelector('.pokedex');
    const container = document.querySelector('.container');

    // Função para ajustar o container ao tamanho da pokedex
    function adjustContainerSize() {
        const pokedexWidth = pokedexImage.clientWidth;
        const pokedexHeight = pokedexImage.clientHeight;

        // Aplicar as dimensões da pokedex ao container
        container.style.width = `${pokedexWidth}px`;
        container.style.height = `${pokedexHeight}px`;
    }

    // Ajustar quando a imagem carregar
    window.addEventListener('load', adjustContainerSize);

    // Ajustar ao redimensionar a janela
    window.addEventListener('resize', adjustContainerSize);
});

let searchPokemon = 1;
let audioUrl = "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg";

const fetchPokemon = async (pokemon) => {
    
    if(pokemon == 538){
        pokemon = 'throh'
    }//erro espeífico na leitura do JSON desse pokemon
    if(pokemon == 'meowstic'){
        pokemon = 'meowstic-male'
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
            pokemonNumber.innerHTML = '#' + String(data.id).padStart(3, '0');
            let types = data.types.map(typeInfo => typeInfo.type.name);
            pokemonType.innerHTML = '';
            types.forEach(type => {
                const typeDiv = document.createElement('div');
                typeDiv.className = `${type}`;
                typeDiv.textContent = type;

                pokemonType.appendChild(typeDiv);
            });
            let stats = data.stats.map(statInfo => statInfo);
            pokemonStat.innerHTML = 'Stats';
            stats.forEach(stat => {
                const statDiv = document.createElement('span');
                statDiv.className = 'stat';
                pokemonStat.appendChild(statDiv);

                const bartotal = document.createElement('div');
                bartotal.className = 'progress-container';
                pokemonStat.appendChild(bartotal);
                const bar = document.createElement('div');
                bar.className = 'progress-bar '+stat.stat.name;
                bartotal.appendChild(bar);

                const progressBar = document.querySelector(`.${stat.stat.name}`);
                console.log(progressBar);
                progressBar.style.width = (((stat.base_stat)*100))/255 + '%';
               

                const statName = document.createElement('span');
                const statValue = document.createElement('span');
                statName.textContent = stat.stat.name +':';
                statValue.textContent = stat.base_stat;
                statDiv.appendChild(statName);
                statDiv.appendChild(statValue);
            });

            audioUrl = data.cries.latest;

            if(data.id <= 649){
                //let arrayname = data.name.split("-");
                //let word = arrayname[0];
                pokemonImg.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
                pokemonName.innerHTML = data.name;
            }else if(data.id == 772){
                pokemonImg.src = 'https://projectpokemon.org/images/normal-sprite/typenull.gif';
                pokemonName.innerHTML = data.name;
            }else if(data.id >= 782 && data.id <= 784){
                pokemonImg.src = `https://projectpokemon.org/images/normal-sprite/${data.name.toLowerCase()}.gif`;
                pokemonName.innerHTML = data.name;
            }else if(data.id >= 785 && data.id <= 788){
                let arrayname = data.name.split("-");
                let word = arrayname[0]+arrayname[1];
                pokemonImg.src = `https://projectpokemon.org/images/normal-sprite/${word.toLowerCase()}.gif`
                pokemonName.innerHTML = data.name;
            }else{
                let arrayname = data.name.split("-");
                let word = arrayname[0];
                pokemonImg.src = `https://projectpokemon.org/images/normal-sprite/${word.toLowerCase()}.gif`
                pokemonName.innerHTML = data.name;
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
