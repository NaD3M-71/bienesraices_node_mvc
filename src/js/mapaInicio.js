
(function(){
    //Mapa Inicio
    const lat = -42.917696;
    const lng = -71.327141;
    const zoom = 13;
    const mapa = L.map("mapa-inicio").setView([lat, lng], zoom);
    let markers = new L.FeatureGroup().addTo(mapa);
    let propiedades = []

    // FIltros
    const filtros = {
      categoria: '',
      precio: ''
    };

    const categoriaSelect = document.querySelector('#categorias');
    const precioSelect = document.querySelector('#precios');
    // Mapa
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);

 
    // Filtrado de Categorias y Precio
    categoriaSelect.addEventListener('change', e =>{
      filtros.categoria = +e.target.value;
      filtrarPropiedades();
    })

    precioSelect.addEventListener('change', e =>{
      filtros.precio = +e.target.value
      filtrarPropiedades();
    })

    const obtenerPropiedades = async ()=>{
      try {
          const url = '/api/propiedades'
          const respuesta =  await fetch(url)
          propiedades = await respuesta.json()

          mostrarPropiedades(propiedades)
      } catch (error) {
          console.log(error);
      }
    }
    const mostrarPropiedades = propiedades =>{
      // Limpiar pines previos
      markers.clearLayers();

      propiedades.forEach(propiedad =>{
          // agregar los pines
          const marker = new L.marker([propiedad?.lat,propiedad?.lng],{
              autoPan: true
          })
          .addTo(mapa)
          .bindPopup(`
          <p class="text-indigo-600 font-bold"> ${propiedad.categoria.nombre}</p>
            <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
            <img src="/uploads/${propiedad.imagen}" alt="Imagen de ${propiedad.titulo}"> 
            <p class="text-gray-600 font-bold"> ${propiedad.precio.nombre}</p>
            <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block font-bold text-white text-center py-2 uppercase">Ver Propiedad</a>
          `)
          markers.addLayer(marker)
          
      })
    }
    const filtrarCategoria = (propiedad) => {
      return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;
  }

  const filtrarPrecio = (propiedad) => {
      return filtros.precio ? propiedad.precioId === filtros.precio : propiedad;
  }
    const filtrarPropiedades = () =>{
      const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio)
      mostrarPropiedades(resultado);
    }
    

  obtenerPropiedades()
})()