import { supabase } from '../supabaseClient.js';

const DEFAULT_CHECKOUT_DATA = {
  room: {
    roomLabel: '',
    summary: '',
  },
  summaryCard: {
    hotelId: '',
    hotelName: '',
    rating: 0,
    reviewsCount: 0,
    policy: '',
    checkIn: '',
    checkOut: '',
    stayNights: 0,
  },
  priceDetails: {
    items: [],
    total: 0,
    currency: '$',
  },
  policyItems: [],
};

const checkoutErrorBanner = document.getElementById('supabase-error');

function showCheckoutError(message, details) {
  if (checkoutErrorBanner) {
    checkoutErrorBanner.style.display = 'block';
    checkoutErrorBanner.innerHTML = `<strong>${message}</strong>${details ? `<div style="margin-top:8px;font-size:0.9rem;color:#881337;">${details}</div>` : ''}`;
  }
}

function clearCheckoutError() {
  if (checkoutErrorBanner) {
    checkoutErrorBanner.style.display = 'none';
    checkoutErrorBanner.textContent = '';
  }
}

async function loadCheckoutData() {
  clearCheckoutError();
  console.log('loadCheckoutData() start');
  let data = JSON.parse(JSON.stringify(DEFAULT_CHECKOUT_DATA));

  try {
    const { data: summaryRows, error: summaryError } = await supabase.from('checkout_summaries').select('*').limit(1);
    const summaryRow = Array.isArray(summaryRows) ? summaryRows[0] : summaryRows;
    console.log('checkout_summaries result', { summaryRow, summaryError });

    if (summaryError) {
      const details = summaryError.message || summaryError.details || JSON.stringify(summaryError);
      if (summaryError.status === 401) {
        showCheckoutError('Error 401: no autorizado. Activa SELECT para la tabla checkout_summaries en Supabase.', details);
      } else {
        showCheckoutError('Error al cargar checkout_summaries.', details);
      }
      return;
    }

    if (summaryRow) {
      data.summaryCard.hotelId = summaryRow.hotelId || summaryRow.hotel_id || summaryRow.id || data.summaryCard.hotelId;
      data.summaryCard.hotelName = summaryRow.hotelName || summaryRow.hotel_name || summaryRow.name || summaryRow.hotel || data.summaryCard.hotelName;
      data.summaryCard.rating = summaryRow.rating ?? summaryRow.stars ?? data.summaryCard.rating;
      data.summaryCard.reviewsCount = summaryRow.reviewsCount ?? summaryRow.reviews_count ?? summaryRow.review_count ?? data.summaryCard.reviewsCount;
      data.summaryCard.policy = summaryRow.policy || summaryRow.badge || summaryRow.policy_text || data.summaryCard.policy;
      data.summaryCard.checkIn = summaryRow.checkIn || summaryRow.check_in || summaryRow.checkin || data.summaryCard.checkIn;
      data.summaryCard.checkOut = summaryRow.checkOut || summaryRow.check_out || summaryRow.checkout || data.summaryCard.checkOut;
      data.summaryCard.stayNights = summaryRow.stayNights || summaryRow.stay_nights || summaryRow.nights || data.summaryCard.stayNights;
      data.room.roomLabel = summaryRow.roomLabel || summaryRow.room_label || summaryRow.room_type || data.room.roomLabel;
      data.room.summary = summaryRow.roomSummary || summaryRow.room_summary || summaryRow.description || data.room.summary;
    }
  } catch (err) {
    console.warn('checkout_summaries query failed:', err);
    showCheckoutError('Error al conectar con Supabase para checkout_summaries.', err.message || String(err));
    return;
  }

  try {
    const { data: roomRows, error: roomError } = await supabase.from('checkout_rooms').select('*').limit(1);
    const roomRow = Array.isArray(roomRows) ? roomRows[0] : roomRows;
    console.log('checkout_rooms result', { roomRow, roomError });

    if (roomError) {
      const details = roomError.message || roomError.details || JSON.stringify(roomError);
      if (roomError.status === 401) {
        showCheckoutError('Error 401: no autorizado. Activa SELECT para la tabla checkout_rooms en Supabase.', details);
      } else {
        showCheckoutError('Error al cargar checkout_rooms.', details);
      }
      return;
    }

    if (roomRow) {
      data.room.roomLabel = roomRow.roomLabel || roomRow.room_label || roomRow.name || data.room.roomLabel;
      data.room.summary = roomRow.summary || roomRow.description || data.room.summary;
    }
  } catch (err) {
    console.warn('checkout_rooms query failed:', err);
    showCheckoutError('Error al conectar con Supabase para checkout_rooms.', err.message || String(err));
    return;
  }

  try {
    const { data: policyRows, error: policyError } = await supabase.from('checkout_policy_items').select('*');
    console.log('checkout_policy_items result', { policyRows, policyError });

    if (policyError) {
      const details = policyError.message || policyError.details || JSON.stringify(policyError);
      if (policyError.status === 401) {
        showCheckoutError('Error 401: no autorizado. Activa SELECT para la tabla checkout_policy_items en Supabase.', details);
      } else {
        showCheckoutError('Error al cargar checkout_policy_items.', details);
      }
      return;
    }

    if (Array.isArray(policyRows)) {
      data.policyItems = policyRows.map(item => item.description || item.text || item.name || item.rule || 'Policy item');
    }
  } catch (err) {
    console.warn('checkout_policy_items query failed:', err);
    showCheckoutError('Error al conectar con Supabase para checkout_policy_items.', err.message || String(err));
    return;
  }

  try {
    const { data: priceRows, error: priceError } = await supabase.from('checkout_price_items').select('*');
    console.log('checkout_price_items result', { priceRows, priceError });

    if (priceError) {
      const details = priceError.message || priceError.details || JSON.stringify(priceError);
      if (priceError.status === 401) {
        showCheckoutError('Error 401: no autorizado. Activa SELECT para la tabla checkout_price_items en Supabase.', details);
      } else {
        showCheckoutError('Error al cargar checkout_price_items.', details);
      }
      return;
    }

    if (Array.isArray(priceRows) && priceRows.length) {
      data.priceDetails.items = priceRows.map((row, index) => ({
        description: row.description || row.item || row.name || `Item ${index + 1}`,
        amount: Number(row.amount ?? row.price ?? row.total ?? 0),
      }));
      data.priceDetails.total = data.priceDetails.items.reduce((sum, item) => sum + item.amount, 0);
      data.priceDetails.currency = priceRows[0].currency || priceRows[0].moneda || data.priceDetails.currency;
    }
  } catch (err) {
    console.warn('checkout_price_items query failed:', err);
    showCheckoutError('Error al conectar con Supabase para checkout_price_items.', err.message || String(err));
    return;
  }

  try {
    const { data: totalRows, error: totalError } = await supabase.from('checkout_price_totals').select('*').limit(1);
    const totalRow = Array.isArray(totalRows) ? totalRows[0] : totalRows;
    console.log('checkout_price_totals result', { totalRow, totalError });

    if (totalError) {
      const details = totalError.message || totalError.details || JSON.stringify(totalError);
      if (totalError.status === 401) {
        showCheckoutError('Error 401: no autorizado. Activa SELECT para la tabla checkout_price_totals en Supabase.', details);
      } else {
        showCheckoutError('Error al cargar checkout_price_totals.', details);
      }
      return;
    }

    if (totalRow) {
      const totalValue = Number(totalRow.total ?? totalRow.amount ?? totalRow.price ?? totalRow.value ?? data.priceDetails.total);
      data.priceDetails.total = Number.isFinite(totalValue) ? totalValue : data.priceDetails.total;
      data.priceDetails.currency = totalRow.currency || totalRow.moneda || data.priceDetails.currency;
    }
  } catch (err) {
    console.warn('checkout_price_totals query failed:', err);
    showCheckoutError('Error al conectar con Supabase para checkout_price_totals.', err.message || String(err));
    return;
  }

  try {
    const { data: searchRows, error: searchError } = await supabase.from('searches').select('*').limit(1);
    const searchRow = Array.isArray(searchRows) ? searchRows[0] : searchRows;
    console.log('searches query result', { searchRow, searchError });

    if (searchError) {
      const details = searchError.message || searchError.details || JSON.stringify(searchError);
      if (searchError.status === 401) {
        showCheckoutError('Error 401: no autorizado. Activa SELECT para la tabla searches en Supabase.', details);
      } else {
        showCheckoutError('Error al cargar searches.', details);
      }
      return;
    }

    if (searchRow) {
      data.summaryCard.checkIn = searchRow.checkin || searchRow.check_in || data.summaryCard.checkIn;
      data.summaryCard.checkOut = searchRow.checkout || searchRow.check_out || data.summaryCard.checkOut;
      data.summaryCard.stayNights = searchRow.stayNights || searchRow.stay_nights || data.summaryCard.stayNights;
    }
  } catch (err) {
    console.warn('searches query failed:', err);
    showCheckoutError('Error al conectar con Supabase para searches.', err.message || String(err));
    return;
  }

  renderCheckout(data);
}

function renderCheckout(data) {
  const roomHeader = document.querySelector('.seccion-header-azul');
  if (roomHeader) {
    roomHeader.innerHTML = `
      <span class="icono-seccion"><img src="/cheakout/imagenes/security-user 1.png" alt=""></span>
      <span>${data.room.roomLabel}</span>
      <span class="texto-secundario-header">${data.room.summary}</span>
    `;
  }

  const policyList = document.querySelector('.lista-informacion');
  if (policyList) {
    policyList.innerHTML = data.policyItems.map(item => `<li>${item}</li>`).join('');
  }

  const hotelNameEl = document.querySelector('.nombre-hotel');
  if (hotelNameEl) hotelNameEl.innerHTML = data.summaryCard.hotelName;

  const ratingEl = document.querySelector('.texto-valoracion');
  if (ratingEl) ratingEl.innerHTML = `${data.summaryCard.rating} (${data.summaryCard.reviewsCount} Reviews)`;

  const policyEl = document.querySelector('.etiqueta-reembolso');
  if (policyEl) policyEl.innerHTML = data.summaryCard.policy;

  const detallesReserva = document.querySelectorAll('.detalle-valor');
  if (detallesReserva.length >= 2) {
    detallesReserva[0].innerHTML = data.summaryCard.checkIn;
    detallesReserva[1].innerHTML = data.summaryCard.checkOut;
  }
  const lastDetalle = document.querySelector('.detalle-item:last-child .detalle-valor');
  if (lastDetalle) {
    lastDetalle.innerHTML = `${data.summaryCard.stayNights} night stay`;
  }

  const precioContenido = document.querySelector('.precio-contenido');
  if (precioContenido) {
    let htmlPrecios = data.priceDetails.items.map(item => `
      <div class="precio-fila">
        <span>${item.description}</span>
        <span>${data.priceDetails.currency} ${Number(item.amount).toFixed(2)}</span>
      </div>
    `).join('');

    htmlPrecios += `
      <div class="precio-fila precio-total">
        <span>Total</span>
        <span class="total-valor">${data.priceDetails.currency}${Number(data.priceDetails.total).toFixed(2)}</span>
      </div>
    `;

    precioContenido.innerHTML = htmlPrecios + `
      <a href="#" class="enlace-cupon">Use a coupon, credit or promotional code</a>
      <div class="campo-cupon">
        <label class="etiqueta-campo">Coupon code</label>
        <div class="grupo-cupon">
          <input type="text" class="input-campo input-cupon" value="200-VOUCHER">
          <button class="boton-cupon">Apply Coupon</button>
        </div>
      </div>
    `;
  }
}

loadCheckoutData();

function subscribeToCheckoutChanges() {
  const channel = supabase.channel('checkout_updates');

  const tablesToWatch = [
    'checkout_summaries',
    'checkout_rooms',
    'checkout_policy_items',
    'checkout_price_items',
    'checkout_price_totals',
    'searches',
  ];

  tablesToWatch.forEach((table) => {
    channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
      console.log(`${table} changed, reloading checkout`);
      loadCheckoutData();
    });
  });

  channel.subscribe((status) => {
    console.log('checkout realtime subscription status:', status);
  });
}

subscribeToCheckoutChanges();

// Poll every 5 seconds as a fallback when realtime is not available
setInterval(() => {
  console.log('Polling Supabase for checkout updates');
  loadCheckoutData();
}, 5000);
