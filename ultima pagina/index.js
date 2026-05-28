import { myTripsData } from './data.js';


let htmlTrips = "";
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