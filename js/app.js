// NUMERO MÁXIMO DE LA POKEDEX DE TESELIA (Para sprite animado)
const numMax = 649;

//Siempre estan los Pokemon al nivel 100 y asi calculamos las estadisticas
//No contamos ni con IV o EV ni naturaleza
class Stats{
  constructor(stats){
    this.hp = Math.floor(stats[0].base_stat * 2 + 110);
    this.currentHp = this.hp;
    this.atk = Math.floor(stats[1].base_stat * 2 + 5);
    this.def = Math.floor(stats[2].base_stat * 2 + 5);
    this.spatk = Math.floor(stats[3].base_stat * 2 + 5);
    this.spdef = Math.floor(stats[4].base_stat * 2 + 5);
    this.spd = Math.floor(stats[5].base_stat * 2 + 5);
  }
}

class Moves{
  constructor(moves){
    this.move1 = moves[0];
    this.move2 = moves[1];
    this.move3 = moves[2];
    this.move4 = moves[3];
  }
}

class Pokemon {
  constructor(name, types, stats, listMoves, moves, hpLevel, img){
    this.name = name;
    this.types = types;
    this.stats = stats;
    this.listMoves = listMoves;
    this.moves = moves;
    this.hpLevel = hpLevel;
    this.img = img;
    
  }
}

rivalPokemon = new Pokemon();
trainerPokemon = new Pokemon();

let ramdonNumRival = Math.floor(Math.random() * 649 + 1);
let ramdonNumTrainer = Math.floor(Math.random() * 649 + 1);

ramdonNumTrainer = 6; //Charizard
ramdonNumRival = 9;   //Blastuas

if (ramdonNumRival == ramdonNumTrainer){

  if(ramdonNumTrainer < 649 ) {
    ramdonNumTrainer++;

  } else {
    ramdonNumTrainer--;
  }
}

rivalHpLevel = document.getElementById("hpLevelRival");
rivalHpLevel.style.width = "100%";
trainerHpLevel = document.getElementById("hpLevelTrainer");
trainerHpLevel.style.width = "100%";

async function loadPokemons() {
  try {
    const resRival = await fetch('https://pokeapi.co/api/v2/pokemon/' + ramdonNumRival);
    const dataRival = await resRival.json();
    if(!resRival.ok) throw new Error('Pokemon rival no encontrado');

    const resTrainer = await fetch('https://pokeapi.co/api/v2/pokemon/' + ramdonNumTrainer);
    const dataTrainer = await resTrainer.json();
    if(!resTrainer.ok) throw new Error('Pokemon aliado no encontrado');
    
    const rivalName = firstUppercase(dataRival.name);
    const trainerName = firstUppercase(dataTrainer.name);

    const rivalType = await getTypes(dataRival.types);
    console.log(rivalType);
    const trainerType = await getTypes(dataTrainer.types);
   
    const rivalStats = new Stats(dataRival.stats);
    const trainerStats = new Stats(dataTrainer.stats);
    
    const rivalMovesList = dataRival.moves;
    const trainerMovesList = dataTrainer.moves;

    var rivalHpLevel = document.getElementById("hpLevelRival");
    rivalHpLevel.style.width = "100%";
    var trainerHpLevel = document.getElementById("hpLevelTrainer");
    trainerHpLevel.style.width = "100%";
    
    const rivalImg = dataRival.sprites.versions["generation-v"]["black-white"].animated.front_default;
    const trainerImg = dataTrainer.sprites.versions["generation-v"]["black-white"].animated.back_default;
    
    rivalMoves = await loadMoves(rivalMovesList)
    trainerMoves = await loadMoves(trainerMovesList);

    rivalPokemon = new Pokemon(rivalName, rivalType ,rivalStats, rivalMovesList, 
                                rivalMoves, rivalHpLevel, rivalImg);
    trainerPokemon = new Pokemon(trainerName, trainerType, trainerStats, trainerMovesList, 
                                  trainerMoves ,trainerHpLevel, trainerImg);

    console.log(rivalPokemon.types);
    document.getElementById('rivalPokemonImg').src = rivalPokemon.img;
    document.getElementById('rivalPokemonName').textContent = rivalPokemon.name;

    document.getElementById('trainerPokemonImg').src = trainerPokemon.img;
    document.getElementById('trainerPokemonName').textContent = trainerPokemon.name;

    document.getElementById('healthNumber').textContent = trainerPokemon.stats.hp;
    document.getElementById('healthNumberMax').textContent = trainerPokemon.stats.hp;

    changeDialog("What will " + trainerName + " do?");
  } catch (e) {
    console.error(e);
  }
}

async function loadMoves(trainerMoves) {
  try {
    
    const numMaxMove = trainerMoves.length - 1;


    if (numMaxMove <= 0){
      loadPokemons();
      return;
    }

    let numMove1 = Math.floor(Math.random() * numMaxMove);

    let numMove2 = Math.floor(Math.random() * numMaxMove);
    if (numMove1 == numMove2) {
      numMove2 = changeNumber(numMove2, numMaxMove);
    }

    let numMove3 = Math.floor(Math.random() * numMaxMove);
    while (numMove3 == numMove2 || numMove3 == numMove1){
      numMove3 = changeNumber(numMove3, numMaxMove);
    }

    let numMove4 = Math.floor(Math.random() * numMaxMove);
    while (numMove4 == numMove2 || numMove4 == numMove1 || numMove4 == numMove3){
      numMove4 = changeNumber(numMove4, numMaxMove);
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

    const moves = [dataMove1, dataMove2, dataMove3, dataMove4];
    const pokemonMoves = new Moves(moves);

    document.getElementById('move1').textContent = firstUppercase(dataMove1.name);
    document.getElementById('move2').textContent = firstUppercase(dataMove2.name);
    document.getElementById('move3').textContent = firstUppercase(dataMove3.name);
    document.getElementById('move4').textContent = firstUppercase(dataMove4.name);

    return pokemonMoves;

  } catch (e) {
    console.error(e);
  }
}

async function getTypes(dataTypes){
  try{
    let types;

    const resType0 = await fetch(dataTypes[0].type.url);
    const dataType0 = await resType0.json();
    if(!resType0.ok) throw new Error('Tipo no encontrado');

    if (dataTypes.length > 1){
      const resType1 = await fetch(dataTypes[1].type.url);
      const dataType1 = await resType1.json();
      if(!resType1.ok) throw new Error('Tipo no encontrado');

      types = [dataType0, dataType1];
      return types;
    }

    types = [dataType0];
    return types
    
  } catch (e) {
    console.error(e);
  }
}

function firstUppercase (name){
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function changeNumber (num, max){
  if (num < max) {
    return num + 1;

  } else {
    return num - 1;
  }
}


//Interaccionamos con los movimientos al clicar en los botones
var useMoves = function (e){
  const eventID = e.target.id;
  const rivalRamdonMove = getRamdonMove(rivalPokemon);
  console.log(eventID);

  //Con los listener elegimos el movimiento que vamos a usar
  switch (eventID) {
    case "move1":
      battleTurns(trainerPokemon.moves.move1, rivalRamdonMove);
      break;
    case "move2":
      battleTurns(trainerPokemon.moves.move2, rivalRamdonMove);
      break;
    case "move3":
      battleTurns(trainerPokemon.moves.move3, rivalRamdonMove);
      break;
    case "move4":
      battleTurns(trainerPokemon.moves.move4, rivalRamdonMove);
      break;
  }
}

//Función para calcular el daño 
function calculateDamage(attackerPokemon, defenderPokemon, move) {
  //Esto cambiará dependiendo del tipo del pokemon y movimiento
  const atackerStat = attackerPokemon.stats.atk;
  const defenderStat = defenderPokemon.stats.def;
  console.log(move);
  const effectivenessBonuses = getAtackMultiplier(move.type.name, defenderPokemon); 

  console.log("Oponnent Defense Stat: " + defenderStat);
  console.log("Trainer Attack Stat: " + atackerStat);
  const attackRatio = (atackerStat) / (defenderStat);
  const rawDamage = (1 * attackRatio * move.power * effectivenessBonuses) / 2 + 1;

  return Math.floor(rawDamage);
}

 function changeOfHp (pokemon, damage) {
  pokemon.stats.currentHp -= damage;

  if (pokemon.stats.currentHp <= 0) {
      pokemon.hpLevel.style.width = 0 +"%";
      if(pokemon.name == trainerPokemon.name){
        document.getElementById("healthNumber").textContent = 0;
      }
      return 0;

  } else {
      porcentaje = pokemon.stats.currentHp / pokemon.stats.hp * 100;
      pokemon.hpLevel.style.width = porcentaje+"%";

      if (porcentaje <= 30){
        pokemon.hpLevel.classList.add("red");
      } else if (porcentaje <= 50){
        pokemon.hpLevel.classList.add("yellow");
      } else {
        pokemon.hpLevel.classList.add("green");
      }

      if(pokemon.name == trainerPokemon.name){
        document.getElementById("healthNumber").textContent = pokemon.stats.currentHp;
      }

      return 1;
  }
}


function changeDialog (text){
  const dialogo = document.getElementById("trainerPokemonDialog");
  dialogo.textContent = '';
  const velocidad = 20;
  let i = 0;

    const intervalo = setInterval(() => {
      if (i < text.length) {
        dialogo.textContent += text.charAt(i);
        i++;

      } else {
        clearInterval(intervalo);
      }
    }, velocidad);
}

async function battleTurns (trainerMove, rivalMove) {
  //Declaramos variables
  let damage;
  let movePower;
  let firstPokemon;
  let firstMove;
  let lastPokemon;
  let lastMove;
  let finalCondition = 1;

  //Escondemos y deshabilitamos la seleccion de movimientos
  setHiddenMoves();

  //Comparar velocidades entre pokemon para que empieze el turno el más rapido
  if (trainerPokemon.stats.spd >= rivalPokemon.stats.spd) {
    firstPokemon = trainerPokemon; 
    firstMove = trainerMove;
    lastPokemon = rivalPokemon;
    lastMove = rivalMove;

  } else {
    firstPokemon = rivalPokemon;
    firstMove = rivalMove;
    lastPokemon = trainerPokemon;
    lastMove = trainerMove;
  }

  //Golpea el pokemon más rápido
  changeDialog(firstPokemon.name + " used " + firstUppercase(firstMove.name) + "!");
  attackAnimation(firstPokemon);
  await new Promise(resolve => setTimeout(resolve, 1000));

  defenseAnimation(lastPokemon);
  movePower = firstMove.power;

  if (movePower == null){
    damage = 0;

  } else {
    damage = calculateDamage(firstPokemon, lastPokemon, firstMove);
    finalCondition = changeOfHp(lastPokemon, damage);
  }

  if(finalCondition == 0){
    battleFinal(lastPokemon);
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  //Golpea el pokemon más lento
  changeDialog(lastPokemon.name + " used " + firstUppercase(lastMove.name) + "!");
  attackAnimation(lastPokemon);
  await new Promise(resolve => setTimeout(resolve, 1000));
  defenseAnimation(firstPokemon);
  movePower = lastMove.power;

  if (movePower == null){
    damage = 0;

  } else {
    damage = calculateDamage(lastPokemon, firstPokemon, lastMove);
    finalCondition = changeOfHp(firstPokemon, damage);
  }

  if(finalCondition == 0){
    battleFinal(firstPokemon);
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  //Volvemos al estado de selección de movimientos
  changeDialog("What will " + trainerPokemon.name + " do?");
  setVisibleMoves();
}

function battleFinal(pokemon){
  setHiddenMoves();
  if (pokemon.name == trainerPokemon.name){
    changeDialog("You lose!");
  } else {
    changeDialog("You win!");
  }
}

function getRamdonMove(pokemon){
  const ramdonNumber = Math.floor(Math.random() * 4 + 1);
  
  switch (ramdonNumber) {
    case 1:
      return pokemon.moves.move1;
    case 2:
      return pokemon.moves.move2;
    case 3:
      return pokemon.moves.move3;
    case 4:
      return pokemon.moves.move4;
  }
 
}

function getAtackMultiplier(moveType, defPokemon){
  let multiplier = 1;
  console.log("Move type " + moveType);
  defPokemon.types.forEach((type) =>{

    type.damage_relations.double_damage_from.forEach((resistance) =>{
      if (resistance.name == moveType){
        multiplier *= 2;
      }
    })

    type.damage_relations.half_damage_from.forEach((resistance) =>{
      if (resistance.name == moveType){
        multiplier /= 2;
      }
    })

    type.damage_relations.no_damage_from.forEach((resistance) =>{
      if (resistance.name == moveType){
        multiplier = 0;
      }
    })
      
  })
  

  console.log("El multiplicador es: " + multiplier);
  return multiplier;
}

function setHiddenMoves (){
  moves.removeEventListener("click", useMoves);
  const movesSelector = document.querySelectorAll('#moves .move');

  movesSelector.forEach((move, index) => {
    move.classList.add("hidden"); 
  });
}

function setVisibleMoves (){ 
  moves.addEventListener("click", useMoves);
  const movesSelector = document.querySelectorAll('#moves .move');

  movesSelector.forEach((move, index) => {
    move.classList.remove("hidden"); 
  });
}


function attackAnimation(pokemon) {
  if (pokemon.name == trainerPokemon.name){
    const imagen = document.getElementById('trainerPokemonImg');
    imagen.style.transform = 'scale(1.8) rotate(30deg)';
    setTimeout(() => {
      imagen.style.transform = 'rotate(0deg)';
      imagen.style.transform = "scale(1.8)";
    }, 300);

  } else {
    const imagen = document.getElementById('rivalPokemonImg');
    imagen.style.transform = 'scale(1.8) rotate(-30deg)';
    setTimeout(() => {
      imagen.style.transform = 'rotate(0deg)';
      imagen.style.transform = "scale(1.8)";
    }, 300);
  }
 }

 function defenseAnimation(pokemon) {
  if(pokemon.name == trainerPokemon.name){
    const imagen = document.getElementById('trainerPokemonImg');
    imagen.classList.remove("blink");
    void imagen.offsetWidth;
    imagen.classList.add("blink");
    
  } else {
    const imagen = document.getElementById('rivalPokemonImg');
    imagen.classList.remove("blink");
    void imagen.offsetWidth;
    imagen.classList.add("blink");
    
  }
 }

//Obtenemos el evento click en cada boton
  var moves = document.querySelectorAll(".move");
  var moves =document.getElementById("moves"); 
  moves.addEventListener("click", useMoves);

  loadPokemons();
