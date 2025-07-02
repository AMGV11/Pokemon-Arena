// Title - Pokemon Arena
// @Author - Antonio Manuel Guisado Valle
// Comentarios:
//  Siempre estan los Pokemon al nivel 100 y asi calculamos las estadisticas
//  No contamos ni con IV o EV ni naturaleza para los calculos

// --------------------------------------------------------- DESCARGA Y USO DE DATOS -----------------------------------------------------------------------

// Función principal para cargar los Pokemon
async function loadPokemons() {
  try {
    let ramdonNumRival = Math.floor(Math.random() * 649 + 1); // Numero aleatorio de eleccion de Pokemon
    let ramdonNumTrainer = Math.floor(Math.random() * 649 + 1);
    checkDiferentNum(ramdonNumRival, ramdonNumTrainer) // Nos aseguramos de que no sean el mismo Pokemon

    // Fetch para conseguir los datos necesarios de cada Pokemon
    const rivalUrl = 'https://pokeapi.co/api/v2/pokemon/' + ramdonNumRival;
    const trainerUrl = 'https://pokeapi.co/api/v2/pokemon/' + ramdonNumTrainer;

    const pokemonUrls = [rivalUrl, trainerUrl];
    const results = await Promise.allSettled(
      pokemonUrls.map(url => fetchData(url))
    );

    // Manejo de errores
    if (results[0].status === 'rejected' || results[1].status === 'rejected') {
        throw new Error('Error al obtener datos de los Pokémon');
    }

    const dataRival = results[0].value;
    const dataTrainer = results[1].value;
    
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
    const rivalHpLevel = document.getElementById("hpLevelRival");
    rivalHpLevel.style.width = "100%";
    const trainerHpLevel = document.getElementById("hpLevelTrainer");
    trainerHpLevel.style.width = "100%";
    
    const rivalImg = dataRival.sprites.versions["generation-v"]["black-white"].animated.front_default;
    const trainerImg = dataTrainer.sprites.versions["generation-v"]["black-white"].animated.back_default;
    
    // Llamamos a la funcion loadMoves para cargar los diferentes movimientos
    const rivalMoves = await loadMoves(rivalMovesList)
    const trainerMoves = await loadMoves(trainerMovesList);

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
    
    changeTextMenu("What will " + trainerName + " do?");

    loadFlag = true;
    loadingAnimation(loadFlag);
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


    // Array de URLs de los movimientos
    const moveUrls = [
        trainerMoves[numMove1].move.url,
        trainerMoves[numMove2].move.url,
        trainerMoves[numMove3].move.url,
        trainerMoves[numMove4].move.url
    ];

    // Ejecutar todos los Fetch en paralelo
    const results = await Promise.allSettled(
        moveUrls.map(url => fetchData(url))
    );

    // Procesar los resultados
    const moves = [];

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            moves.push(result.value);
        } else {
            throw new Error('Fallo al cargar movimiento ' + index);
        }
    });

    const pokemonMoves = new Moves(moves);

    // Actualizamos los movimientos de la interfaz
    document.getElementById('move1').textContent = firstUppercase(moves[0].name);
    document.getElementById('move2').textContent = firstUppercase(moves[1].name);
    document.getElementById('move3').textContent = firstUppercase(moves[2].name);
    document.getElementById('move4').textContent = firstUppercase(moves[3].name);

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
    const dataType0 = await fetchData(dataTypes[0].type.url);
    console.log(dataType0.name);
        
    if (dataTypes.length > 1){ // Si el Pokemon tiene mas de un tipo
      const dataType1 = await fetchData(dataTypes[1].type.url);
      types = [dataType0, dataType1];
      console.log(dataType1.name);
      return types;
    }
    
    types = [dataType0];
    return types
    
  } catch (e) {
    console.error(e);
  }
}