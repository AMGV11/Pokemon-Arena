// Title - Pokemon Arena
// @Author - Antonio Manuel Guisado Valle
// Comentarios:
//  Siempre estan los Pokemon al nivel 100 y asi calculamos las estadisticas
//  No contamos ni con IV o EV ni naturaleza para los calculos

// --------------------------------------------------------- FUNCIONES AUXILIARES -----------------------------------------------------------------------

// Función auxiliar para poner la primera letra en mayúscula
function firstUppercase (name){
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Función auxiliar para cambiar un número de valor dependiendo de un máximo que se establezca
function changeNumber (num, max){
  if (num < max) {
    return num + 1;

  } else {
    return num - 1;
  }
}

// Función auxiliar para comprobar que no se ha elegido al mismo Pokemon y cambiarlo en caso afirmativo
function checkDiferentNum (ramdonNumRival, ramdonNumTrainer){
  if (ramdonNumRival == ramdonNumTrainer){
    
    if(ramdonNumTrainer < 649 ) {
      ramdonNumTrainer+=1;
      
    } else {
      ramdonNumTrainer-=1;
    }
  }
}

// Función auxiliar para obtener el evento click en cada boton de los movimientos del jugador
function setBtnListener(){
  var moves = document.getElementById("moves"); 
  moves.addEventListener("click", useMoves);
}

// Función auxiliar encargada de mostrar el modal (Usado al final del combate)
function showModal(){
  modal.classList.add("show");
}

// Función auxiliar encargada de el funcionamiento del boton "Yes" del modal
btnYes.onclick = async function() {
  loadFlag = false;
  loadingAnimation(loadFlag); 
  await new Promise(resolve => setTimeout(resolve, 2000));
  location.reload(); //Recargar pagina
}

// Función auxiliar encargada de el funcionamiento del boton "No" del modal
btnNo.onclick = function() {
  modal.style.display = "none";
  window.location.href = "index.html";
}

// Función auxiliar para obtener los datos de un movimiento
async function fetchData (url)  {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Dato no encontrado');
    return await res.json();
};

// --------------------------------------------------------- ANIMACIONES -----------------------------------------------------------------------

// Función usada para cambiar el texto del cuadro de diálogo y presentarlo como si se estubiera escribiendo
function changeTextMenu (text){
  const textMenu = document.getElementById("trainerPokemonText");
  textMenu.textContent = '';
  const speed = 20;
  let i = 0;

    const intervalo = setInterval(() => {
      if (i < text.length) {
        textMenu.textContent += text.charAt(i);
        i++;

      } else {
        clearInterval(intervalo);
      }
    }, speed);
}

// Función usada para ocultar los movimientos en la UI
function setHiddenMoves (){
  moves.style.pointerEvents = "none";

  const movesSelector = document.querySelectorAll('#moves .move');
  movesSelector.forEach((move, index) => {
    move.classList.add("hidden"); 
  });
}

// Función usada para mostrar los movimientos en la UI
function setVisibleMoves (){ 
  moves.style.pointerEvents = "auto";

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

 // Función encargada de la animación de cuando se ha terminado de cargar
 function loadingAnimation(load){
  loadingScreen = document.getElementById("blackOverlay");

  if (load == false){
    loadingScreen.classList.remove("clear");
  } else {
    loadingScreen.classList.add("clear");
  }
 }

 // --------------------------------------------------------- EJECUCIÓN -----------------------------------------------------------------------
  setBtnListener()
  loadPokemons();// Carga inicial
