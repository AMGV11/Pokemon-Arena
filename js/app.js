// NUMERO MÁXIMO DE LA POKEDEX DE TESELIA (Para sprite animado)
const numMax = 649;

//Siempre estan los Pokemon al nivel 100 y asi calculamos las estadisticas
//No contamos ni con IV o EV ni naturaleza

// Definición de objetos
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

// Definición de variables
rivalPokemon = new Pokemon();
trainerPokemon = new Pokemon();

let effectivenessBonuses; // Multiplicador de poder dependiendo de los tipos
let ramdonNumRival = Math.floor(Math.random() * 649 + 1); // Numero aleatorio de eleccion de Pokemon
let ramdonNumTrainer = Math.floor(Math.random() * 649 + 1);
checkDiferentNum(ramdonNumRival, ramdonNumTrainer) // Nos aseguramos de que no sean el mismo Pokemon



// ramdonNumTrainer = 6; // Con este numero elegimos a Charizard
// ramdonNumRival = 9;   //Con este numero elegimos a Blastuas

// --------------------------------------------------------- DESCARGA Y USO DE DATOS -----------------------------------------------------------------------

// Función principal para cargar los Pokemon
async function loadPokemons() {
  try {
    // Fetch para conseguir los datos necesarios de cada Pokemon
    const resRival = await fetch('https://pokeapi.co/api/v2/pokemon/' + ramdonNumRival);
    const dataRival = await resRival.json();
    if(!resRival.ok) throw new Error('Pokemon rival no encontrado');

    const resTrainer = await fetch('https://pokeapi.co/api/v2/pokemon/' + ramdonNumTrainer);
    const dataTrainer = await resTrainer.json();
    if(!resTrainer.ok) throw new Error('Pokemon aliado no encontrado');
    
    // Formateamos y declaramos las distintas constantes y variables que formaran los datos de los Pokemon
    const rivalName = firstUppercase(dataRival.name);
    const trainerName = firstUppercase(dataTrainer.name);

    const rivalType = await getTypes(dataRival.types); // Llamamos a la funcion para conseguir los datos de los tipos
    const trainerType = await getTypes(dataTrainer.types);
   
    const rivalStats = new Stats(dataRival.stats);
    const trainerStats = new Stats(dataTrainer.stats);
    
    const rivalMovesList = dataRival.moves;
    const trainerMovesList = dataTrainer.moves;

    // Inicializamos la barra de HP 
    var rivalHpLevel = document.getElementById("hpLevelRival");
    rivalHpLevel.style.width = "100%";
    var trainerHpLevel = document.getElementById("hpLevelTrainer");
    trainerHpLevel.style.width = "100%";
    
    const rivalImg = dataRival.sprites.versions["generation-v"]["black-white"].animated.front_default;
    const trainerImg = dataTrainer.sprites.versions["generation-v"]["black-white"].animated.back_default;
    
    // Llamamos a la funcion loadMoves para cargar los diferentes movimientos
    rivalMoves = await loadMoves(rivalMovesList)
    trainerMoves = await loadMoves(trainerMovesList);

    // Actualizamos las variables y creamos los objetos
    rivalPokemon = new Pokemon(rivalName, rivalType ,rivalStats, rivalMovesList, 
                                rivalMoves, rivalHpLevel, rivalImg);
    trainerPokemon = new Pokemon(trainerName, trainerType, trainerStats, trainerMovesList, 
                                  trainerMoves ,trainerHpLevel, trainerImg);

    // Actualizamos con las imagenes, nombres y estadisticas los componentes
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

// Función para cargar y guardar los movimientos y sus datos en los objetos Pokemon 
async function loadMoves(trainerMoves) {
  try {

    const numMaxMove = trainerMoves.length - 1;

    // Comprobación de que se han cargado bien los Pokemon
    if (numMaxMove < 4){
      loadPokemons();
      return;
    }

    // Elegimos aleatoriamente los movimientos y nos aseguramos de que no coincidan
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

    // Fetch para conseguir los datos de los movimientos
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

    // Actualizamos los movimientos de la interfaz
    document.getElementById('move1').textContent = firstUppercase(dataMove1.name);
    document.getElementById('move2').textContent = firstUppercase(dataMove2.name);
    document.getElementById('move3').textContent = firstUppercase(dataMove3.name);
    document.getElementById('move4').textContent = firstUppercase(dataMove4.name);

    return pokemonMoves;

  } catch (e) {
    console.error(e);
  }
}


// Función para conseguir los datos de los tipos de los Pokemon (como debilidades y fortalezas)
async function getTypes(dataTypes){
  try{
    let types;
    
    // Fetch para los datos
    const resType0 = await fetch(dataTypes[0].type.url);
    const dataType0 = await resType0.json();
    if(!resType0.ok) throw new Error('Tipo no encontrado');
    
    
    if (dataTypes.length > 1){ // Si el Pokemon tiene mas de un tipo
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

// --------------------------------------------------------- TURNO DEL COMBATE -----------------------------------------------------------------------

// Funcion para simular los turnos en el combate
async function battleTurns (trainerMove, rivalMove) {
  // Variables
  let damage;
  let movePower;
  let firstPokemon;
  let firstMove;
  let lastPokemon;
  let lastMove;
  let finalCondition = 1;

  // rivalPokemon.stats.currentHp = 1; // Para probar final del combate
  // Escondemos y deshabilitamos la seleccion de movimientos
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
    damage = 30;
    finalCondition = changeOfHp(lastPokemon, damage);
    effectivenessCheck();


  } else {
    damage = calculateDamage(firstPokemon, lastPokemon, firstMove);
    finalCondition = changeOfHp(lastPokemon, damage);
    effectivenessCheck();

  }

  // Si se ha derrotado al otro Pokemon se sigue con la secuencia de final
  if(finalCondition == 0){
    await new Promise(resolve => setTimeout(resolve, 2000));
    battleFinal(lastPokemon);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showModal();
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
    damage = 30;
    finalCondition = changeOfHp(firstPokemon, damage);
    effectivenessCheck();


  } else {
    damage = calculateDamage(lastPokemon, firstPokemon, lastMove);
    finalCondition = changeOfHp(firstPokemon, damage);
    effectivenessCheck();

  }

  // Si se ha derrotado al otro Pokemon se sigue con la secuencia de final
  if(finalCondition == 0){
    await new Promise(resolve => setTimeout(resolve, 2000));
    battleFinal(firstPokemon);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showModal();
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));
  
  //Volvemos al estado de selección de movimientos
  changeDialog("What will " + trainerPokemon.name + " do?");
  setVisibleMoves();
}

// Función para la secuencia final del combate
function battleFinal(pokemon){
  setHiddenMoves();

  if (pokemon.name == trainerPokemon.name){
    faintAnimation(trainerPokemon);
    changeDialog("You lose!");
  } else {
    faintAnimation(rivalPokemon);
    changeDialog("You win!");
  }
}

// --------------------------------------------------------- USO DE MOVIMIENTOS Y DAÑO -----------------------------------------------------------------------

//Funcion con la que interaccionamos con los movimientos al clicar en los botones
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

// Función usada para elegir un movimiento al azar que ejecutara el rival
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

// Función para calcular la efectividad del ataque
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

// Función para plasmar en el cuadro de dialogo la efectividad del ataque
function effectivenessCheck(){
  console.log(effectivenessBonuses);
  if (effectivenessBonuses == 1){

  } else if (effectivenessBonuses > 1){
    changeDialog("It's super effective!");
  } else if (effectivenessBonuses < 1){
    changeDialog("It's not very effective...");
  }
}

// Función para calcular el daño 
function calculateDamage(attackerPokemon, defenderPokemon, move) {

  // Constantes y variables
  const atackerStat = attackerPokemon.stats.atk;
  const defenderStat = defenderPokemon.stats.def;
  effectivenessBonuses = getAtackMultiplier(move.type.name, defenderPokemon); // Cambia dependiendo de la efectividad entre tipos

  // Calculo del daño
  const attackRatio = (atackerStat) / (defenderStat);
  const rawDamage = (1 * attackRatio * move.power * effectivenessBonuses) / 2 + 1;

  return Math.floor(rawDamage);
}

// Función para cambiar el componente de la barra de HP y su HP actual
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

// --------------------------------------------------------- FUNCIONES AUXILIARES -----------------------------------------------------------------------

// Función para poner la primera letra en mayúscula
function firstUppercase (name){
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Función para cambiar un número de valor dependiendo de un máximo que se establezca
function changeNumber (num, max){
  if (num < max) {
    return num + 1;

  } else {
    return num - 1;
  }
}

// Función para comprobar que no se ha elegido al mismo Pokemon y cambiarlo en caso afirmativo
function checkDiferentNum (ramdonNumRival, ramdonNumTrainer){
  if (ramdonNumRival == ramdonNumTrainer){
    
    if(ramdonNumTrainer < 649 ) {
      ramdonNumTrainer+=1;
      
    } else {
      ramdonNumTrainer-=1;
    }
  }
}

// Obtenemos el evento click en cada boton de movimiento del jugador
var moves = document.getElementById("moves"); 
moves.addEventListener("click", useMoves);

// Obtenemos las constantes para manejar el modal
const modal = document.getElementById("retry");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");

// Función encargada de mostrar el modal (Usado al final del combate)
function showModal(){
  modal.classList.add("show");
}

// Función encargada de el funcionamiento del boton "Yes" del modal
btnYes.onclick = function() {
  location.reload(); //Recargar pagina
}

// Función encargada de el funcionamiento del boton "No" del modal
btnNo.onclick = function() {
  modal.style.display = "none";
  window.location.href = "index.html";
}

// --------------------------------------------------------- ANIMACIONES -----------------------------------------------------------------------

// Función usada para cambiar el texto del cuadro de diálogo y presentarlo como si se estubiera escribiendo
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

// Función usada para ocultar los movimientos en la UI
function setHiddenMoves (){
  moves.removeEventListener("click", useMoves);
  const movesSelector = document.querySelectorAll('#moves .move');

  movesSelector.forEach((move, index) => {
    move.classList.add("hidden"); 
  });
}

// Función usada para mostrar los movimientos en la UI
function setVisibleMoves (){ 
  moves.addEventListener("click", useMoves);
  const movesSelector = document.querySelectorAll('#moves .move');

  movesSelector.forEach((move, index) => {
    move.classList.remove("hidden"); 
  });
}

// Función encargada de la animación del ataque de los Pokemon
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

 // Función encargada de la animación de la defensa de los Pokemon
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

 // Función encargada de la animación del desmayo de los Pokemon
 function faintAnimation(pokemon){
  if (pokemon.name == trainerPokemon.name){
    const imagen = document.getElementById('trainerPokemonImg');
    void imagen.offsetWidth;
    imagen.classList.remove("blink");
    imagen.classList.add("faint");

  } else {
    const imagen = document.getElementById('rivalPokemonImg');
    void imagen.offsetWidth;
    imagen.classList.remove("blink");
    imagen.classList.add("faint");
  }
 }

 // --------------------------------------------------------- EJECUCIÓN -----------------------------------------------------------------------

  loadPokemons();