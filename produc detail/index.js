import { productDetailData } from './data.js';


document.querySelector(".titulo").innerHTML = productDetailData.hotel.name;
document.querySelector(".puntos-texto").innerHTML = `${productDetailData.hotel.rating} (${productDetailData.hotel.reviewsCount} Reviews)`;
document.querySelector(".sitio span:last-child").innerHTML = productDetailData.hotel.address;
document.querySelector(".resumen .texto").innerHTML = productDetailData.hotel.overviewText;


let htmlFacilities = "";
for (let i = 0; i < productDetailData.topFacilities.length; i++) {
    htmlFacilities += `
        <div class="servicio">
            <span class="icono"><img src="${productDetailData.topFacilities[i].id}" alt=""></span>
            <span>${productDetailData.topFacilities[i].label}</span>
        </div>
    `;
}
document.querySelector(".servicios-lista").innerHTML = htmlFacilities;


let htmlArea = "";
for (let i = 0; i < productDetailData.exploreArea.length; i++) {
    htmlArea += `
        <li class="lugar">
            <span class="icono"><img src="/produc detail/imagenes/bxs-map 1.png" alt=""></span>
            <span class="lugar-nombre">${productDetailData.exploreArea[i].name}</span>
            <span class="lugar-tiempo">${productDetailData.exploreArea[i].distance}</span>
        </li>
    `;
}
document.querySelector(".lugares").innerHTML = htmlArea;


let htmlRooms = "";
htmlRooms += `
    <div class="oferta">
        <div class="oferta-marca">my Dream Place</div>
        <div class="oferta-caja">
            <h3 class="oferta-precio">20% off</h3>
            <p class="oferta-texto">Use Promotional</p>
            <p class="oferta-texto"> Coupon Code:</p>
            <p class="oferta-codigo">Orlando</p>
        </div>
        <img src="/produc detail/imagenes/Frame.png" alt="" class="oferta-imagen">
    </div>
`;

for (let i = 0; i < productDetailData.rooms.length; i++) {
    htmlRooms += `
        <div class="cuarto">
            <img src="${productDetailData.rooms[i].imatge}" alt="" class="cuarto-imagen">
            <div class="cuarto-datos">
                <h3 class="cuarto-titulo">${productDetailData.rooms[i].name}</h3>
                <div class="cuarto-info">
                    <span class="info-item"><i class="fa-solid fa-briefcase"></i>${productDetailData.rooms[i].price} sq ft</span>
                    <span class="info-item"><i class="fa-solid fa-bed"></i>Sleeps ${productDetailData.rooms[i].sleeps}</span>
                </div>
                <div class="cuarto-info">
                    <span class="info-item"><i class="fa-solid fa-thumbs-up"></i>${productDetailData.rooms[i].beds}</span>
                </div>
                <button class="boton-reserva boton-azul">Reserve suite</button>
            </div>
        </div>
    `;
}
document.querySelector(".cuartos-lista").innerHTML = htmlRooms;