import { supabase } from '../supabaseClient.js';

const errorBanner = document.getElementById('supabase-error');

function showSupabaseError(message, details) {
  if (errorBanner) {
    errorBanner.style.display = 'block';
    errorBanner.innerHTML = `<strong>${message}</strong>${details ? `<div style="margin-top:8px;font-size:0.9rem;color:#881337;">${details}</div>` : ''}`;
  }
}

function clearSupabaseError() {
  if (errorBanner) {
    errorBanner.style.display = 'none';
    errorBanner.textContent = '';
  }
}

function renderTrips(trips = []) {
  const htmlTrips = trips.map(trip => `
        <div class="tarjeta-viaje">
            <div class="imagen-viaje">
                <img src="${trip.imatge}" alt="${trip.hotelName}">
            </div>
            <div class="detalles-viaje">
                <h3 class="nombre-hotel">${trip.hotelName}</h3>
                <div class="valoracion">
                    <span class="estrellas">&#9733;&#9733;&#9733;&#9733;&#9734;</span>
                    <span class="resenas">${trip.rating} (${trip.reviewsCount} Reviews)</span>
                </div>
                <p class="politica-reembolso">${trip.policy}</p>
                <p class="info-entrada">Check in: ${trip.checkIn}</p>
                <p class="info-entrada">Check out: ${trip.checkOut}</p>
                <p class="duracion-estancia">${trip.stayNights} night stay</p>
            </div>
            <div class="precio-viaje">
                <p class="info-habitacion">${trip.rooms} room ${trip.stayNights} days</p>
                <div class="contenedor-precio">
                    <span class="precio-anterior">${trip.currency}${trip.oldPrice}</span>
                    <span class="precio-nuevo">${trip.currency}${trip.price}</span>
                </div>
                <p class="info-impuestos">Includes taxes and fees</p>
                <a href="#" class="boton-ver-detalles">View trip details</a>
            </div>
        </div>
    `).join('');

  const container = document.querySelector('.mis-viajes');
  if (container) {
    container.innerHTML = '<h2 class="titulo-seccion">My trips</h2>' + htmlTrips;
  }
}

function renderDestinations(destinations = []) {
  const htmlDestinos = destinations.map(destino => `
        <div class="tarjeta-destino">
            <div class="imagen-destino">
                <img src="${destino.imatgeUrl}" alt="${destino.nom}">
            </div>
            <h3 class="nombre-destino">${destino.nom}</h3>
            <p class="cantidad-propiedades">${destino.propietatsCount} properties</p>
        </div>
    `).join('');

  const container = document.querySelector('.cuadricula-destinos');
  if (container) {
    container.innerHTML = htmlDestinos;
  }
}

async function loadUltimaPaginaData() {
  clearSupabaseError();

  try {
    const { data: trips, error: tripsError } = await supabase
      .from('my_trips')
      .select('*');

    if (tripsError) {
      const details = tripsError.message || tripsError.details || JSON.stringify(tripsError);
      if (tripsError.status === 401) {
        showSupabaseError('Error 401: no autorizado. Habilita SELECT para my_trips.', details);
      } else {
        showSupabaseError('Error cargando my_trips desde Supabase.', details);
      }
      return;
    }

    const normalizedTrips = Array.isArray(trips)
      ? trips.map(trip => ({
          hotelName: trip.hotel_name || trip.hotelName || trip.name || '',
          rating: trip.rating ?? trip.stars ?? 0,
          reviewsCount: trip.reviews_count ?? trip.reviewsCount ?? 0,
          policy: trip.policy || trip.policy_text || 'Non refundable',
          checkIn: trip.check_in || trip.checkIn || '',
          checkOut: trip.check_out || trip.checkOut || '',
          stayNights: trip.stay_nights ?? trip.stayNights ?? 0,
          rooms: trip.rooms ?? trip.room_count ?? 1,
          oldPrice: trip.old_price ?? trip.oldPrice ?? 0,
          price: trip.price ?? trip.amount ?? 0,
          currency: trip.currency || '$',
          imatge: trip.imatge || trip.image || trip.image_url || '/ultima pagina/imagenes/Rectangle 32 (1).png',
        }))
      : [];

    renderTrips(normalizedTrips);
  } catch (err) {
    console.warn('my_trips query failed:', err);
    showSupabaseError('Error de conexión con Supabase para my_trips.', err.message || String(err));
    return;
  }

  try {
    const { data: destinations, error: destinationsError } = await supabase
      .from('suggested_destinations')
      .select('*');

    if (destinationsError) {
      const details = destinationsError.message || destinationsError.details || JSON.stringify(destinationsError);
      if (destinationsError.status === 401) {
        showSupabaseError('Error 401: no autorizado. Habilita SELECT para suggested_destinations.', details);
      } else {
        showSupabaseError('Error cargando suggested_destinations desde Supabase.', details);
      }
      return;
    }

    const normalizedDestinations = Array.isArray(destinations)
      ? destinations.map(destino => ({
          nom: destino.nom || destino.name || destino.title || '',
          imatgeUrl: destino.imatge_url || destino.imatgeUrl || destino.image || '/ultima pagina/imagenes/Rectangle 8.png',
          propietatsCount: destino.propietats_count ?? destino.propietatsCount ?? destino.properties_count ?? 0,
        }))
      : [];

    renderDestinations(normalizedDestinations);
  } catch (err) {
    console.warn('suggested_destinations query failed:', err);
    showSupabaseError('Error de conexión con Supabase para suggested_destinations.', err.message || String(err));
    return;
  }
}

loadUltimaPaginaData();
for (let i = 0; i < myTripsData.trips.length; i++) {
    const trip = myTripsData.trips[i];
    htmlTrips += `
        <div class="tarjeta-viaje">
            <div class="imagen-viaje">
                <img src="${trip.imatge}" alt="${trip.hotelName}">
            </div>
            <div class="detalles-viaje">
                <h3 class="nombre-hotel">${trip.hotelName}</h3>
                <div class="valoracion">
                    <span class="estrellas">&#9733;&#9733;&#9733;&#9733;&#9734;</span>
                    <span class="resenas">${trip.rating} (${trip.reviewsCount} Reviews)</span>
                </div>
                <p class="politica-reembolso">${trip.policy}</p>
                <p class="info-entrada">Check in: ${trip.checkIn}</p>
                <p class="info-entrada">Check out: ${trip.checkOut}</p>
                <p class="duracion-estancia">${trip.stayNights} night stay</p>
            </div>
            <div class="precio-viaje">
                <p class="info-habitacion">${trip.rooms} room ${trip.stayNights} days</p>
                <div class="contenedor-precio">
                    <span class="precio-anterior">${trip.currency}${trip.oldPrice}</span>
                    <span class="precio-nuevo">${trip.currency}${trip.price}</span>
                </div>
                <p class="info-impuestos">Includes taxes and fees</p>
                <a href="#" class="boton-ver-detalles">View trip details</a>
            </div>
        </div>
    `;
}

document.querySelector(".mis-viajes").innerHTML = '<h2 class="titulo-seccion">My trips</h2>' + htmlTrips;



let htmlDestinos = "";
for (let i = 0; i < myTripsData.suggestedDestinations.length; i++) {
    const destino = myTripsData.suggestedDestinations[i];
    htmlDestinos += `
        <div class="tarjeta-destino">
            <div class="imagen-destino">
                <img src="${destino.imatgeUrl}" alt="${destino.nom}">
            </div>
            <h3 class="nombre-destino">${destino.nom}</h3>
            <p class="cantidad-propiedades">${destino.propietatsCount} properties</p>
        </div>
    `;
}

document.querySelector(".cuadricula-destinos").innerHTML = htmlDestinos;