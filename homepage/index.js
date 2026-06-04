
import { supabase } from '../supabaseClient.js';


async function carregarSitios() {
  const { data, error } = await supabase.from("destacades").select("*");

  if (error) {
    console.error("Error cargando sitios:", error);
    return;
  }

  let html = "";

  data.forEach(item => {
    html += `
      <li>
        <img src="${item.imatge_url}" alt="${item.nom}">
        <h1>${item.nom}</h1>
        <h2>${item.propietats_count || 0} properties</h2>
      </li>
    `;
  });

  document.querySelector(".sitios").innerHTML = html;
}


async function carregarOfertes() {
  const { data, error } = await supabase.from("ofertes").select("*");

  if (error) {
    console.error("Error cargando ofertas:", error);
    return;
  }

  let html = "";

  data.forEach(item => {
    html += `
      <li>
        <img src="${item.imatge_url}">
        <h1>${item.titol}</h1>
        <h2>${item.descripcio}</h2>
      </li>
    `;
  });

  document.querySelector(".ofer").innerHTML = html;
}


async function carregarPopulars() {
  const { data, error } = await supabase.from("populars").select("*");

  if (error) {
    console.error("Error cargando populares:", error);
    return;
  }

  let html = "";

  data.forEach(item => {
    html += `
      <li>
        <img src="${item.imatge_url}">
        <h1>${item.nom}</h1>
        <h2>${item.propietats_count || 0}</h2>
      </li>
    `;
  });

  document.querySelector("#popu").innerHTML = html;
}


carregarSitios();
carregarOfertes();
carregarPopulars();