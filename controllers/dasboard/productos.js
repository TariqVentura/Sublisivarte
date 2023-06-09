const msj = document.getElementById('mensaje').value
const icon = document.getElementById('icon').value
const confirmation = document.getElementById('confirmation').value

document.addEventListener("DOMContentLoaded", function (event) {
    console.log(confirmation)
    if (confirmation == 'true') {
        Swal.fire({
            icon: icon,
            text: msj
          })
    }
    

});
function openCreate() {
    Swal.fire({
        title: 'Agregar producto',
        width: "400px",
        /* Campos del modal agregar que seran enviados*/
        html:
            '<div><label for="input-name">Nombre:</label><input id="input-name" type="text" class="swal2-input"></div>' +
            '<div><label for="input-description">Descripción:</label><input id="input-description" type="text" class="swal2-input"></div>' +
            '<div><label for="input-price">Precio:</label><input id="input-price" type="number" class="swal2-input"></div>' +
            '<div><label for="input-stock">Stock:</label><input id="input-stock" type="number" class="swal2-input"></div>' +
            '<div><label for="input-image">Imagen:</label><input id="input-image" type="file" class="swal2-file"></div>',
        showCancelButton: true,
        confirmButtonColor: "green",
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",

        preConfirm: () => {
            return {
                name: document.getElementById('input-name').value,
                description: document.getElementById('input-description').value,
                price: document.getElementById('input-price').value,
                stock: document.getElementById('input-stock').value,
                image: document.getElementById('input-image').files[0]
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const product = result.value;
            // Hacer algo con los valores del producto (por ejemplo, enviarlos al servidor)
            Swal.fire({
                title: 'Producto agregado',
                icon: 'success'
            });
        }
    });
}

function openCreate2() {
    Swal.fire({
        title: 'Editar producto',
        width: "400px",
        /* Campos del modal editar que seran enviados*/
        html:
            '<div><label for="input-name">Nombre:</label><input id="input-name" type="text" class="swal2-input"></div>' +
            '<div><label for="input-description">Descripción:</label><input id="input-description" type="text" class="swal2-input"></div>' +
            '<div><label for="input-price">Precio:</label><input id="input-price" type="number" class="swal2-input"></div>' +
            '<div><label for="input-stock">Stock:</label><input id="input-stock" type="number" class="swal2-input"></div>' +
            '<div><label for="input-image">Imagen:</label><input id="input-image" type="file" class="swal2-file"></div>',
        showCancelButton: true,
        confirmButtonColor: "green",
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            return {
                name: document.getElementById('input-name').value,
                description: document.getElementById('input-description').value,
                price: document.getElementById('input-price').value,
                stock: document.getElementById('input-stock').value,
                image: document.getElementById('input-image').files[0]
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const product = result.value;
            // Hacer algo con los valores del producto (por ejemplo, enviarlos al servidor)
            Swal.fire({
                title: 'Producto editado',
                icon: 'success'
            });
        }
    });
}

function openCreate3() {
    Swal.fire({
        title: '¿Desea eliminar este producto?',
        width: "400px",
        /* Pregunta de seguridad para la eliminacion de un producto----*/
        html:
            '<div><label for="input-name">El producto seleccionado sera eliminado permanentemente</label></div>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "red",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            const product = result.value;
            // Hacer algo con los valores del producto (por ejemplo, enviarlos al servidor)
            Swal.fire({
                title: 'Producto eliminado',
                icon: 'success'
            });
        }
    });
}