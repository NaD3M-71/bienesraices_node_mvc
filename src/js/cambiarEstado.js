(function(){
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado')

    cambiarEstadoBotones.forEach( boton =>{
        addEventListener('click', cambiarEstadoPropiedad)
    })

    async function cambiarEstadoPropiedad(e){
        const { propiedadId: id} = e.target.dataset
        // console.log(id); //dataset me permite acceder a un atributo personalizado del elemento html
        try {
            const url = `/propiedades/${id}`

            const respuesta = await fetch(url, {
            method:'PUT'
            })

            const {resultado} = await respuesta.json()

            if(resultado){
                if(e.target.classList.contains('bg-yellow-100')){
                    e.target.classList.add('bg-green-100','text-green-800')
                    e.target.classList.remove('bg-yellow-100','text-yellow-800')
                    e.target.textContent = 'Publicado'
                }else{
                    e.target.classList.add('bg-yellow-100','text-yellow-800')
                    e.target.classList.remove('bg-green-100','text-green-800')
                    e.target.textContent = 'No Publicado'
                    }
            }
        } catch (error) {
            console.log(error);
        }
    }
})()