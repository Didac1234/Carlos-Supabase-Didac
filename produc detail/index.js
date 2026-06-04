import { supabase } from '../supabaseClient.js';

const DEFAULT_PRODUCT_ID = 'lakeside-motel-warefront';
const PRODUCT_ID = new URLSearchParams(window.location.search).get('id') || DEFAULT_PRODUCT_ID;

function createEmptyProductData() {
  return {
    hotel: {
      id: PRODUCT_ID,
      name: '',
      rating: 0,
      reviewsCount: 0,
      address: '',
      overviewText: '',
    },
    topFacilities: [],
    exploreArea: [],
    availability: {
      checkin: '',
      checkout: '',
      guests: '',
    },
    promoCard: {
      title: '',
    },
    rooms: [],
  };
}

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

async function loadProductDetail() {
  clearSupabaseError();
  let data = createEmptyProductData();

  try {
    const { data: productRows, error: productError } = await supabase
      .from('product_details')
      .select('*')
      .eq('id', PRODUCT_ID)
      .maybeSingle();

    console.log('product_details result', { productRows, productError });
    if (productError) {
      const details = productError.message || productError.details || JSON.stringify(productError);
      if (productError.status === 401) {
        showSupabaseError('Error 401: no autorizado. Activa SELECT para la tabla product_details en Supabase o ejecuta la política anon.', details);
        return;
      }
      console.warn('product_details error:', productError);
      showSupabaseError('Error en product_details.', details);
      return;
    }

    if (productRows) {
      data.hotel.name = productRows.name || data.hotel.name;
      data.hotel.rating = productRows.rating ?? data.hotel.rating;
      data.hotel.reviewsCount = productRows.reviews_count ?? productRows.reviewsCount ?? data.hotel.reviewsCount;
      data.hotel.address = productRows.address || data.hotel.address;
      data.hotel.overviewText = productRows.overview_text || data.hotel.overviewText || data.hotel.overviewText;
    }
  } catch (err) {
    console.warn('product_details query failed:', err);
    showSupabaseError('Error al conectar con Supabase. Revisa la consola y la configuración de RLS.');
    return;
  }

  try {
    const { data: facilities, error: facilitiesError } = await supabase
      .from('product_top_facilities')
      .select('*')
      .eq('product_id', PRODUCT_ID);

    console.log('product_top_facilities result', { facilities, facilitiesError });
    if (facilitiesError) {
      const details = facilitiesError.message || facilitiesError.details || JSON.stringify(facilitiesError);
      if (facilitiesError.status === 401) {
        showSupabaseError('Error 401: no autorizado. Activa SELECT para la tabla product_top_facilities en Supabase.', details);
        return;
      }
      console.warn('product_top_facilities error:', facilitiesError);
      showSupabaseError('Error en product_top_facilities.', details);
      return;
    }

    if (!facilitiesError && Array.isArray(facilities) && facilities.length) {
      data.topFacilities = data.topFacilities.concat(
        facilities.map(item => ({
          id: item.icon_url || item.image_url || item.icon || item.id,
          label: item.label || item.name || item.title || '',
        }))
      );
    }
  } catch (err) {
    console.warn('product_top_facilities query failed:', err);
    showSupabaseError('Error al conectar con Supabase. Revisa la consola y la configuración de RLS.');
    return;
  }

  try {
    const { data: areaRows, error: areaError } = await supabase
      .from('product_explore_area')
      .select('*')
      .eq('product_id', PRODUCT_ID);

    console.log('product_explore_area result', { areaRows, areaError });
    if (areaError) {
      const details = areaError.message || areaError.details || JSON.stringify(areaError);
      if (areaError.status === 401) {
        showSupabaseError('Error 401: no autorizado. Activa SELECT para la tabla product_explore_area en Supabase.', details);
        return;
      }
      console.warn('product_explore_area error:', areaError);
      showSupabaseError('Error en product_explore_area.', details);
      return;
    }

    if (!areaError && Array.isArray(areaRows) && areaRows.length) {
      data.exploreArea = data.exploreArea.concat(
        areaRows.map(item => ({
          name: item.name || item.place || '',
          distance: item.distance || item.time || '',
        }))
      );
    }
  } catch (err) {
    console.warn('product_explore_area query failed:', err);
    showSupabaseError('Error al conectar con Supabase. Revisa la consola y la configuración de RLS.');
    return;
  }

  try {
    const { data: availabilityRows, error: availabilityError } = await supabase
      .from('product_availability')
      .select('*')
      .eq('product_id', PRODUCT_ID)
      .limit(1)
      .maybeSingle();

    console.log('product_availability result', { availabilityRows, availabilityError });
    if (availabilityError) {
      const details = availabilityError.message || availabilityError.details || JSON.stringify(availabilityError);
      if (availabilityError.status === 401) {
        showSupabaseError('Error 401: no autorizado. Activa SELECT para la tabla product_availability en Supabase.', details);
      } else {
        console.warn('product_availability error:', availabilityError);
        showSupabaseError('Error en product_availability.', details);
      }
      return;
    }

    if (availabilityRows) {
      data.availability.checkin = availabilityRows.checkin || availabilityRows.check_in || data.availability.checkin;
      data.availability.checkout = availabilityRows.checkout || availabilityRows.check_out || data.availability.checkout;
      data.availability.guests = availabilityRows.guests || data.availability.guests;
    }
  } catch (err) {
    console.warn('product_availability query failed:', err);
    showSupabaseError('Error al conectar con Supabase. Revisa la consola y la configuración de RLS.');
    return;
  }

  try {
    const { data: promoRows, error: promoError } = await supabase
      .from('product_promo_cards')
      .select('*')
      .eq('product_id', PRODUCT_ID)
      .limit(1)
      .maybeSingle();

    console.log('product_promo_cards result', { promoRows, promoError });
    if (promoError) {
      const details = promoError.message || promoError.details || JSON.stringify(promoError);
      if (promoError.status === 401) {
        showSupabaseError('Error 401: no autorizado. Activa SELECT para la tabla product_promo_cards en Supabase.', details);
      } else {
        console.warn('product_promo_cards error:', promoError);
        showSupabaseError('Error en product_promo_cards.', details);
      }
      return;
    }

    if (promoRows) {
      data.promoCard.title = promoRows.title || promoRows.text || data.promoCard.title;
    }
  } catch (err) {
    console.warn('product_promo_cards query failed:', err);
    showSupabaseError('Error al conectar con Supabase. Revisa la consola y la configuración de RLS.');
    return;
  }

  try {
    const { data: roomRows, error: roomError } = await supabase
      .from('product_rooms')
      .select('*')
      .eq('product_id', PRODUCT_ID);

    console.log('product_rooms result', { roomRows, roomError });
    if (roomError) {
      const details = roomError.message || roomError.details || JSON.stringify(roomError);
      if (roomError.status === 401) {
        showSupabaseError('Error 401: no autorizado. Activa SELECT para la tabla product_rooms en Supabase.', details);
      } else {
        console.warn('product_rooms error:', roomError);
        showSupabaseError('Error en product_rooms.', details);
      }
      return;
    }

    if (Array.isArray(roomRows) && roomRows.length) {
      data.rooms = data.rooms.concat(
        roomRows.map(room => ({
          id: room.id || room.room_id || room.name,
          name: room.name || room.room_name || '',
          imatge: room.image || room.img || room.imatge || '',
          price: Number(room.price ?? room.amount ?? 0),
          currency: room.currency || '$',
          sleeps: Number(room.sleeps ?? room.capacity ?? 0),
          beds: room.beds || room.bed_description || '',
        }))
      );
    }
  } catch (err) {
    console.warn('product_rooms query failed:', err);
    showSupabaseError('Error al conectar con Supabase. Revisa la consola y la configuración de RLS.');
    return;
  }

  renderProductDetail(data);
}

function renderProductDetail(data) {
  document.querySelector('.titulo').innerHTML = data.hotel.name;
  document.querySelector('.puntos-texto').innerHTML = `${data.hotel.rating} (${data.hotel.reviewsCount} Reviews)`;
  const sitioDireccion = document.querySelector('.sitio-direccion');
  if (sitioDireccion) sitioDireccion.innerHTML = data.hotel.address;

  const resumenTexto = document.querySelector('.resumen .texto');
  if (resumenTexto) {
    resumenTexto.innerHTML = data.hotel.overviewText
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.trim()}</p>`)
      .join('');
  }

  const checkinEl = document.querySelector('.checkin-value');
  if (checkinEl) checkinEl.textContent = data.availability.checkin;
  const checkoutEl = document.querySelector('.checkout-value');
  if (checkoutEl) checkoutEl.textContent = data.availability.checkout;
  const guestsEl = document.querySelector('.guests-value');
  if (guestsEl) guestsEl.textContent = data.availability.guests;

  const serviciosLista = document.querySelector('.servicios-lista');
  if (serviciosLista) {
    serviciosLista.innerHTML = data.topFacilities
      .map(facility => `
        <div class="servicio">
          <span class="icono"><img src="${facility.id}" alt=""></span>
          <span>${facility.label}</span>
        </div>
      `)
      .join('');
  }

  const lugaresLista = document.querySelector('.lugares');
  if (lugaresLista) {
    lugaresLista.innerHTML = data.exploreArea
      .map(areaItem => `
        <li class="lugar">
          <span class="icono"><img src="/produc detail/imagenes/bxs-map 1.png" alt=""></span>
          <span class="lugar-nombre">${areaItem.name}</span>
          <span class="lugar-tiempo">${areaItem.distance}</span>
        </li>
      `)
      .join('');
  }

  let htmlRooms = `
    <div class="oferta">
      <div class="oferta-marca">my Dream Place</div>
      <div class="oferta-caja">
        <h3 class="oferta-precio">${data.promoCard.title.split('\n')[0] || 'Promo'}</h3>
        <p class="oferta-texto">${data.promoCard.title.split('\n')[1] || ''}</p>
        <p class="oferta-texto">${data.promoCard.title.split('\n')[2] || ''}</p>
        <p class="oferta-codigo">${data.promoCard.title.split('\n')[3] || ''}</p>
      </div>
      <img src="/produc detail/imagenes/Frame.png" alt="" class="oferta-imagen">
    </div>
  `;

  for (const room of data.rooms) {
    htmlRooms += `
      <div class="cuarto">
        <img src="${room.imatge}" alt="" class="cuarto-imagen">
        <div class="cuarto-datos">
          <h3 class="cuarto-titulo">${room.name}</h3>
          <div class="cuarto-info">
            <span class="info-item"><i class="fa-solid fa-briefcase"></i>${room.price} ${room.currency}</span>
            <span class="info-item"><i class="fa-solid fa-bed"></i>Sleeps ${room.sleeps}</span>
          </div>
          <div class="cuarto-info">
            <span class="info-item"><i class="fa-solid fa-thumbs-up"></i>${room.beds}</span>
          </div>
          <button class="boton-reserva boton-azul">Reserve suite</button>
        </div>
      </div>
    `;
  }

  const cuartosLista = document.querySelector('.cuartos-lista');
  if (cuartosLista) cuartosLista.innerHTML = htmlRooms;
}

loadProductDetail();

setInterval(() => {
  loadProductDetail();
}, 10000);
