// Title - Pokemon Arena
// @Author - Antonio Manuel Guisado Valle
// Comentarios:
//  Siempre estan los Pokemon al nivel 100 y asi calculamos las estadisticas
//  No contamos ni con IV o EV ni naturaleza para los calculos

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
  changeTextMenu(firstPokemon.name + " used " + firstUppercase(firstMove.name) + "!");
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
  changeTextMenu(lastPokemon.name + " used " + firstUppercase(lastMove.name) + "!");
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
  changeTextMenu("What will " + trainerPokemon.name + " do?");
  setVisibleMoves();
}

// Función para la secuencia final del combate
function battleFinal(pokemon){
  setHiddenMoves();

  if (pokemon.name == trainerPokemon.name){
    faintAnimation(trainerPokemon);
    changeTextMenu("You lose!");
  } else {
    faintAnimation(rivalPokemon);
    changeTextMenu("You win!");
  }
}

// --------------------------------------------------------- USO DE MOVIMIENTOS Y DAÑO -----------------------------------------------------------------------

//Funcion con la que interaccionamos con los movimientos al clicar en los botones
var useMoves = function (e){
  const eventID = e.target.id;
  const rivalRamdonMove = getRamdonMove(rivalPokemon);

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
  return multiplier;
}

// Función para plasmar en el cuadro de texto del menu la efectividad del ataque
function effectivenessCheck(){
  if (effectivenessBonuses == 1){
    return;
  } else if (effectivenessBonuses > 1){
    changeTextMenu("It's super effective!");
  } else if (effectivenessBonuses < 1){
    changeTextMenu("It's not very effective...");
  }
}

// Función para calcular el daño 
function calculateDamage(attackerPokemon, defenderPokemon, move) {
  // Constantes y variables
  const moveType = move.damage_class.name // Tipo del movimiento (Fisico o especial)
  let atackerStat;
  let defenderStat;

  // Cambiamos las estadisticas dependiendo del tipo de ataque
  if (moveType == "special"){
    atackerStat = attackerPokemon.stats.spatk;
    defenderStat = defenderPokemon.stats.spdef;

  } else {
    atackerStat = attackerPokemon.stats.atk;
    defenderStat = defenderPokemon.stats.def;
  }
  
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