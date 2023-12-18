(function () {
  const lat = document.querySelector('#lat').value || -42.917696;
  const lng = document.querySelector('#lng').value || -71.327141;
  const zoom = 13;
  const mapa = L.map("mapa").setView([lat, lng], zoom);
  let marker;

  //Utilizar provider y geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();
  // Mapa
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // El Marcador
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  //Detectar el movimiento del marcador
  marker.on("moveend", function (e) {
    marker = e.target;
    const posicion = marker.getLatLng();
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
    // Obtener la informacion de las calles al soltar el pin
    geocodeService
      .reverse()
      .latlng(posicion, zoom)
      .run(function (error, resultado) {
        // console.log(resultado);
        marker.bindPopup(resultado.address.LongLabel);

        //Llenar los campos hidden con nuestro resultado
        document.querySelector(".calle").textContent =
          resultado?.address?.Address ?? "";
        document.querySelector("#calle").value =
          resultado?.address?.Address ?? "";
        document.querySelector("#lat").value = resultado?.latlng?.lat ?? "";
        document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";
      });
  });
})();
