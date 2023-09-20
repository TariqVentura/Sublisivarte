const FS = require('fs')

exports.deleteFile = (fileName) => {
    FS.access(fileName, FS.constants.F_OK, (err) => {
        if (err) {
            console.error('El archivo no existe o no se puede acceder a él.')
        } else {
            // El archivo existe, procedemos a eliminarlo
            FS.unlink(fileName, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err)
                } else {
                    console.log('El archivo se ha eliminado correctamente.')
                }
            });
        }
    })
}