import { Dropzone } from 'dropzone';

Dropzone.options.imagen = {
    dictDefaultMessage: 'Haz click para cargar tus imagenes o suelta tu imagen aqui', 
    acceptedFiles: '.png,.jpg,.jpeg', 
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1, 
    autoProcessQueue: false, 
    addRemoveLinks: true, 
    dictRemoveFile: 'Borrar imagen', 
    dictMaxFilesExceeded: 'El limite de archivos es 1', 
    paramName: 'imagen',
    init: function(){
        const dropzone = this
        const btnPrublicar = document.querySelector('#publicar')

        btnPrublicar.addEventListener('click', function(){
            dropzone.processQueue()
        })
        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href= '/mis-propiedades' 
            }
        })
    }
} 