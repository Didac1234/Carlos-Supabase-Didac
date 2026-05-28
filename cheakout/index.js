import { checkoutData } from './data.js';


const roomHeader = document.querySelector(".seccion-header-azul");
roomHeader.innerHTML = `
    <span class="icono-seccion"><img src="/cheakout/imagenes/security-user 1.png" alt=""></span>
    <span>${checkoutData.room.roomLabel}</span>
    <span class="texto-secundario-header">${checkoutData.room.summary}</span>
`;


let htmlPolicies = "";
for (let i = 0; i < checkoutData.policyItems.length; i++) {
  htmlPolicies += `<li>${checkoutData.policyItems[i]}</li>`;
}
document.querySelector(".lista-informacion").innerHTML = htmlPolicies;


document.querySelector(".nombre-hotel").innerHTML = checkoutData.summaryCard.hotelName;
document.querySelector(".texto-valoracion").innerHTML = `${checkoutData.summaryCard.rating} (${checkoutData.summaryCard.reviewsCount} Reviews)`;
document.querySelector(".etiqueta-reembolso").innerHTML = checkoutData.summaryCard.policy;

const detallesReserva = document.querySelectorAll(".detalle-valor");
detallesReserva[0].innerHTML = checkoutData.summaryCard.checkIn;
detallesReserva[1].innerHTML = checkoutData.summaryCard.checkOut;
document.querySelector(".detalle-item:last-child .detalle-valor").innerHTML = `${checkoutData.summaryCard.stayNights} night stay`;


let htmlPrecios = "";
for (let i = 0; i < checkoutData.priceDetails.items.length; i++) {
  htmlPrecios += `
    <div class="precio-fila">
      <span>${checkoutData.priceDetails.items[i].description}</span>
      <span>${checkoutData.priceDetails.currency} ${checkoutData.priceDetails.items[i].amount}</span>
    </div>
  `;
}


htmlPrecios += `
    <div class="precio-fila precio-total">
      <span>Total</span>
      <span class="total-valor">${checkoutData.priceDetails.currency}${checkoutData.priceDetails.total}</span>
    </div>
`;

document.querySelector(".precio-contenido").innerHTML = htmlPrecios + `
    <a href="#" class="enlace-cupon">Use a coupon, credit or promotional code</a>
    <div class="campo-cupon">
      <label class="etiqueta-campo">Coupon code</label>
      <div class="grupo-cupon">
        <input type="text" class="input-campo input-cupon" value="200-VOUCHER">
        <button class="boton-cupon">Apply Coupon</button>
      </div>
    </div>
`;