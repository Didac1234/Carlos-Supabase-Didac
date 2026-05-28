import { Reseñas } from './rese.js';

const contenedor = document.querySelector(".formulario-buscador");

const { where, checkin, checkout, guests } = Reseñas.query;

let html = `
  <div class="input-grupo">
    <span class="input-icono">
      <img src="/reseñas/imagenes/Group (2).png" alt="">
    </span>
    <input type="text" value="${where}">
  </div>

  <div class="input-grupo">
    <span class="input-icono">
      <img src="/reseñas/imagenes/calendar 1.png" alt="">
    </span>
    <input type="text" value="${checkin}">
  </div>

  <div class="input-grupo">
    <span class="input-icono">
      <img src="/reseñas/imagenes/calendar 1.png" alt="">
    </span>
    <input type="text" value="${checkout}">
  </div>

  <div class="input-grupo">
    <span class="input-icono">
      <img src="/reseñas/imagenes/user-square 1.png" alt="">
    </span>
    <input type="text" value="${guests}">
  </div>

  <button class="boton-principal">Search</button>
`;
contenedor.innerHTML  = html


let html2 =`
    <span>${Reseñas.totalResults}</span>
`
document.querySelector("#num").innerHTML = html2


let html3 = "";

for (let i = 0; i < Reseñas.filters.budgetRanges.length; i++) {
 

  html3 += `
    <label class="opcion-filtro">
      <input type="checkbox">
      <span>$ ${Reseñas.filters.budgetRanges[i].min} - $ ${Reseñas.filters.budgetRanges[i].max}</span>
      <span class="cantidad-resultados">${Reseñas.filters.budgetRanges[i].count}</span>
    </label>
  `;
}

document.querySelector(".filtro-precio").innerHTML = html3;





let html4 = "";

for (let i = 0; i < Reseñas.filters.popularFilters.length; i++) {
 

  html4 += `
    <label class="opcion-filtro">
      <input type="checkbox">
      <span> ${Reseñas.filters.popularFilters[i].label}</span>
      <span class="cantidad-resultados">${Reseñas.filters.popularFilters[i].count}</span>
    </label>
  `;
}

document.querySelector(".Filtros").innerHTML = html4;


let html5 = "";

for (let i = 0; i < Reseñas.filters.activities.length; i++) {
 

  html5 += `
    <label class="opcion-filtro">
      <input type="checkbox">
      <span> ${Reseñas.filters.activities[i].label}</span>
      <span class="cantidad-resultados">${Reseñas.filters.activities[i].count}</span>
    </label>
  `;
}

document.querySelector(".Act").innerHTML = html5;



