import { Dropzone } from 'dropzone';

Dropzone.options.imagen = {
    dictDefaultMessage: 'Haz click para cargar tus imagenes o suelta tu imagen aqui', //traduccion del Mensaje que se muestra en dropzone
    acceptedFiles: '.png,.jpg,.jpeg', // tipos de formatos aceptados
    maxFilesize: 5,// cantidad en mb maximos aceptados por imagen
    maxFiles: 1, // maxima cantidad de elementos que deja subir
    parallelUploads: 1, // maxima cantidad de elementos que deja subir en paralelo o a la vez
    autoProcessQueue: false, //este parametro permite una presubida de archivos apenas eligen una imagen, genera problemas si el usuario decide no subir la primera imagen y cambiarla luego asi que se deja en false generalmente.
    addRemoveLinks: true, // agrega un enlace para borrar la imagen que elegimos, por default esta en false.
    dictRemoveFile: 'Borrar imagen', // traduccion al boton de remove file
    dictMaxFilesExceeded: 'El limite de archivos es 1', // Traduccion al error de maximos archivos subidos superado
    paramName: 'imagen', // parametro para reconocer la subida de imagen
    init: function(){ 

        //Esta linea lo que va a hacer es asignar el boton y el evento de este para que se suban los archivos, la funcion es processQueue() es un metodo de dropzone.
        const dropzone = this
        const btnPrublicar = document.querySelector('#publicar')

        btnPrublicar.addEventListener('click', function(){
            dropzone.processQueue()
        })
        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href= '/mis-propiedades' // La redireccion la tenemos que hacer por JS porque estamos ejecutando JS ahora, no Node.
            }
        })
    }
}