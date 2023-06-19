const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () =>{
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e){
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if ( ciudad === '' || pais === ''){

        mostrarError('Ambos campos son obligatorios');
        return;
    }else{
        consultarApi(ciudad, pais);
    }

    //Consultar la API

};

function mostrarError(mensaje){
    const existeAlerta = document.querySelector('.bg-red-100');
    if(!existeAlerta){

        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
        <strong class = "font-bold">Error!</strong>
        <span class = "block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);

        setTimeout( () => {
            alerta.remove();
        }, 3600 );
    }
}

function consultarApi(ciudad, pais){

    const appId = 'a6124f2436c600053146cf5b70c27ad4';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    Spinner();
    fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {
            limpiarHTML(); // limpia los grados previos
            if(datos.cod === '404'){
                mostrarError('Ciudad no encontrada.');
                return;
            }
            mostrarClima(datos);
        });
}

function mostrarClima(datos){
    const { name, main:{ temp, temp_max, temp_min } } = datos;
    const centigrados = kelvinACentrigrados(temp);
    const max = kelvinACentrigrados(temp_max);
    const min = kelvinACentrigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en: ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Máx: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');


    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);


    resultado.appendChild(resultadoDiv); 
}

function kelvinACentrigrados(grados){
    return parseInt(grados - 273.15);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner(){
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML =
    `
    <div class="spinner">
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
    </div>
    `;

    resultado.appendChild(divSpinner);
}