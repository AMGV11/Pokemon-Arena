// Title - Pokemon Arena
// @Author - Antonio Manuel Guisado Valle
// Comentarios:
//  Siempre estan los Pokemon al nivel 100 y asi calculamos las estadisticas
//  No contamos ni con IV o EV ni naturaleza para los calculos

// --------------------------------------------------------- DECLARACIÓN DE CONSTANTES, OBJETOS Y VARIABLES -----------------------------------------------------------------------

// Definición de objetos
class Stats{
  constructor(stats){ // Hacemos los calculos de las estadísticas en el constructor de la clase
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

// Definición de variables y constantes
const numMax = 649; // Numero máximo de la Pokedex de Teselia (Necesario para el sprite animado)
const modal = document.getElementById("retry");// Obtenemos las constantes para manejar el modal
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");

var rivalPokemon = new Pokemon();
var trainerPokemon = new Pokemon();

let effectivenessBonuses; // Multiplicador de poder dependiendo de los tipos
let loadFlag = false;// Flag para saber cuando se ha terminado de cargar los pokemon

// ramdonNumTrainer = 6; // Con este numero elegimos a Charizard (Para pruebas)
// ramdonNumRival = 9;   //Con este numero elegimos a Blastoise (Para pruebas)