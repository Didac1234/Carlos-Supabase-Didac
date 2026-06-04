import { Reseñas } from './rese.js';
import { supabase } from '../supabaseClient.js';

const contenedor = document.querySelector(".formulario-buscador");

async function loadData() {
  try {
    let search = null;
    try {
      const { data: searches, error: errSearch } = await supabase.from('searches').select('*').limit(1).order('id', { ascending: true });
      if (!errSearch) {
        search = (searches && searches[0]) ? searches[0] : null;
      }
    } catch (err) {
      console.warn('searches table error:', err);
    }

    let query = search ? {
      where: search.where,
      checkin: search.checkin,
      checkout: search.checkout,
      guests: search.guests,
    } : Reseñas.query;

    // Only query filtered data if search exists, otherwise use fallback
    let budget = Reseñas.filters.budgetRanges;
    let popular = Reseñas.filters.popularFilters;
    let acts = Reseñas.filters.activities;
    let results = Reseñas.results;

    // Query all data from tables (no filtering by search_id)
    try {
      const { data: budgetRanges, error: errBudget } = await supabase.from('budget_ranges').select('*');
      if (!errBudget && budgetRanges && budgetRanges.length) budget = budgetRanges;
    } catch (err) {
      // ignore
    }

    try {
      const { data: popularFilters, error: errPopular } = await supabase.from('popular_filters').select('*');
      if (!errPopular && popularFilters && popularFilters.length) popular = popularFilters;
    } catch (err) {
      // ignore
    }

    try {
      const { data: activities, error: errActivities } = await supabase.from('activities').select('*');
      if (!errActivities && activities && activities.length) acts = activities;
    } catch (err) {
      // ignore
    }

    try {
      const { data: hotels, error: errHotels } = await supabase.from('hotels').select('*').limit(100);
      if (!errHotels && hotels && hotels.length) results = hotels;
    } catch (err) {
      // ignore
    }

    const totalResults = results.length || Reseñas.totalResults;

    render(query, { budgetRanges: budget, popularFilters: popular, activities: acts }, results, totalResults);
  } catch (e) {
    console.error('Critical error:', e);
    render(Reseñas.query, Reseñas.filters, Reseñas.results, Reseñas.totalResults);
  }
}

function render(query, filters, results, totalResults) {
  const { where, checkin, checkout, guests } = query;

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
  contenedor.innerHTML = html;

  document.querySelector("#num").innerHTML = `<span>${totalResults}</span>`;

  // budget ranges
  const precioContainer = document.querySelector(".filtro-precio");
  let html3 = "";
  if (filters.budgetRanges && filters.budgetRanges.length > 0) {
    for (let i = 0; i < filters.budgetRanges.length; i++) {
      const b = filters.budgetRanges[i];
      html3 += `
        <label class="opcion-filtro">
          <input type="checkbox">
          <span>$ ${b.min_price ?? b.min} - $ ${b.max_price ?? b.max}</span>
          <span class="cantidad-resultados">${b.count}</span>
        </label>
      `;
    }
  }
  if (precioContainer) {
    precioContainer.innerHTML = html3;
  }

  // popular filters
  let html4 = "";
  for (let i = 0; i < filters.popularFilters.length; i++) {
    const p = filters.popularFilters[i];
    html4 += `
      <label class="opcion-filtro">
        <input type="checkbox">
        <span> ${p.label}</span>
        <span class="cantidad-resultados">${p.count}</span>
      </label>
    `;
  }
  document.querySelector(".Filtros").innerHTML = html4;

  // activities
  let html5 = "";
  for (let i = 0; i < filters.activities.length; i++) {
    const a = filters.activities[i];
    html5 += `
      <label class="opcion-filtro">
        <input type="checkbox">
        <span> ${a.label}</span>
        <span class="cantidad-resultados">${a.count}</span>
      </label>
    `;
  }
  document.querySelector(".Act").innerHTML = html5;

  // render hotels from results
  const hotelsContainer = document.querySelector(".hotels-list");
  if (hotelsContainer) {
    let htmlHotels = "";
    for (let i = 0; i < results.length; i++) {
      const hotel = results[i];
      const badgeClass = hotel.badge ? (hotel.badge.includes('30%') ? 'destacada' : 'especial') : '';
      const badgeHtml = hotel.badge ? `<span class="etiqueta-oferta ${badgeClass}">${hotel.badge}</span>` : "";
      const oldPriceHtml = (hotel.old_price ?? hotel.oldPrice) ? `<span class="precio-tachado">${hotel.old_price ?? hotel.oldPrice}</span>` : "";
      
      htmlHotels += `
        <div class="ficha-alojamiento">
          <img src="${hotel.image_url ?? '/reseñas/imagenes/Rectangle 25.png'}" alt="${hotel.name}" class="foto-alojamiento">
          <div class="detalles-alojamiento">
            <h2>${hotel.name}</h2>
            ${badgeHtml}
            <div class="puntuacion">⭐⭐⭐⭐⭐ ${hotel.rating || 4.5} (${hotel.reviewsCount || 1200} Reviews)</div>
            <p class="lema-alojamiento">Live a little and celebrate with champagne</p>
            <p class="resumen-alojamiento">${hotel.description || 'Reats include a glass of French champagne, parking and a late checkout. Gym included. Flexible cancellation applies.'}</p>
            <button class="boton-secundario">See availability</button>
          </div>
          <div class="info-precio">
            <span class="detalle-estancia">1 room 2 days</span>
            ${oldPriceHtml}
            <span class="precio-final">${hotel.price_per_night ?? hotel.pricePerNight ?? '$0'}</span>
            <span class="aclaracion-precio">Includes taxes and fees</span>
          </div>
        </div>
      `;
    }
    hotelsContainer.innerHTML = htmlHotels;
  }
}

loadData();

// Subscribe to real-time changes
function subscribeToChanges() {
  // Listen to budget_ranges changes
  supabase
    .channel('budget_ranges_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'budget_ranges' }, (payload) => {
      console.log('budget_ranges changed:', payload);
      loadData();
    })
    .subscribe();

  // Listen to popular_filters changes
  supabase
    .channel('popular_filters_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'popular_filters' }, (payload) => {
      console.log('popular_filters changed:', payload);
      loadData();
    })
    .subscribe();

  // Listen to activities changes
  supabase
    .channel('activities_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, (payload) => {
      console.log('activities changed:', payload);
      loadData();
    })
    .subscribe();

  // Listen to hotels changes
  supabase
    .channel('hotels_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'hotels' }, (payload) => {
      console.log('hotels changed:', payload);
      loadData();
    })
    .subscribe();
}

subscribeToChanges();

