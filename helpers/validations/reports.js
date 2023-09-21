//declaramos fs (File Server)
const FS = require('fs')

//creamos el metodo
exports.deleteFile = (fileName) => {
    //buscamos el archvio que queremos eliminar
    FS.access(fileName, FS.constants.F_OK, (err) => {
        //en caso de encontrarlo
        if (err) {
            console.error('El archivo no existe o no se puede acceder a él.')
        } else {
            // El archivo existe, procedemos a eliminarlo
            FS.unlink(fileName, (err) => {
                if (err) {
                    //manejamos el error
                    console.error('Error al eliminar el archivo:', err)
                } else {
                    console.log('El archivo se ha eliminado correctamente.')
                }
            })
        }
    })
} 