// NUMERO MÁXIMO DE LA POKEDEX DE TESELIA (Para sprite animado)
const numMax = 649;

let ramdonNumRival = Math.floor(Math.random() * 650);
let ramdonNumTrainer = Math.floor(Math.random() * 650);

if (ramdonNumRival == ramdonNumTrainer){

  if(ramdonNumTrainer < 649) {
    ramdonNumTrainer++;

  } else {
    ramdonNumTrainer--
  }

}

async function loadPokemons() {
  try {
    const resRival = await fetch('https://pokeapi.co/api/v2/pokemon/' + ramdonNumRival);
    const dataRival = await resRival.json();
    if(!resRival.ok) throw new Error('Pokemon rival no encontrado');

    const resTrainer = await fetch('https://pokeapi.co/api/v2/pokemon/' + ramdonNumTrainer);
    const dataTrainer = await resTrainer.json();
    if(!resTrainer.ok) throw new Error('Pokemon aliado no encontrado');

    const imagenRival = dataRival.sprites.versions["generation-v"]["black-white"].animated.front_default;
    const imagenTrainer = dataTrainer.sprites.versions["generation-v"]["black-white"].animated.back_default;
    
    document.getElementById('rivalPokemonImg').src = imagenRival;
    document.getElementById('rivalPokemonName').textContent = firstUppercase(dataRival.name);

    document.getElementById('trainerPokemonImg').src = imagenTrainer;
    document.getElementById('trainerPokemonName').textContent = firstUppercase(dataTrainer.name);

    document.getElementById('trainerPokemonDialog').textContent = firstUppercase(dataTrainer.name);
    document.getElementById('healthNumber').textContent = dataTrainer.stats[0].base_stat;
    document.getElementById('healthNumberMax').textContent = dataTrainer.stats[0].base_stat;
    
    loadMoves(dataRival, dataTrainer);

  } catch (e) {
    console.error(e);
    
    
  }
}

async function loadMoves(dataRival, dataTrainer) {
  try {
    
    console.log(dataTrainer);
    const trainerMoves = dataRival.moves;
    const numMaxMove = trainerMoves.length;

    let numMove1 = Math.floor(Math.random() * numMaxMove + 1);

    let numMove2 = Math.floor(Math.random() * numMaxMove + 1);
    if (numMove1 == numMove2) {
      changeNumber(numMove2, numMaxMove);
    }

    let numMove3 = Math.floor(Math.random() * numMaxMove + 1);
    while (numMove3 == numMove2 || numMove3 == numMove1){
      changeNumber(numMove3, numMaxMove);
    }

    let numMove4 = Math.floor(Math.random() * numMaxMove + 1);
    while (numMove4 == numMove2 || numMove4 == numMove1 || numMove4 == numMove3){
      changeNumber(numMove4, numMaxMove);
    }

    const resMove1 = await fetch(trainerMoves[numMove1].move.url);
    const dataMove1 = await resMove1.json();
    if(!resMove1.ok) throw new Error('Movimiento no encontrado');

    const resMove2 = await fetch(trainerMoves[numMove2].move.url);
    const dataMove2 = await resMove2.json();
    if(!resMove2.ok) throw new Error('Movimiento no encontrado');

    const resMove3 = await fetch(trainerMoves[numMove3].move.url);
    const dataMove3 = await resMove3.json();
    if(!resMove3.ok) throw new Error('Movimiento no encontrado');

    const resMove4 = await fetch(trainerMoves[numMove4].move.url);
    const dataMove4 = await resMove4.json();
    if(!resMove4.ok) throw new Error('Movimiento no encontrado');

    document.getElementById('move1').textContent = firstUppercase(dataMove1.name);
    document.getElementById('move2').textContent = firstUppercase(dataMove2.name);
    document.getElementById('move3').textContent = firstUppercase(dataMove3.name);
    document.getElementById('move4').textContent = firstUppercase(dataMove4.name);

    console.log(dataMove1);

  } catch (e) {
    console.error(e);
    
  }
}

function firstUppercase (name){
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function changeNumber (num, max){
  if (num < max) {
    return num ++;

  } else {
    return num --;
  }
}

loadPokemons();
