//Alerta para Crear clientes
function openCreate() {
    const { value: formValues } = Swal.fire({

        title: 'Crear Cliente',
        width: "400px",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "green",
        html:
            // son los inputs de la alerta para crear clientes
            '<div > <div ><input id="swal-input1" placeholder="Nombres" class="swal2-input"></div> <div ><input id="swal-input2" placeholder="Apellidos" class="swal2-input"></div></div>' +

            '<div ><div ><input id="iemail" type="email" placeholder="Correo" class="swal2-input"></div><div ><input id="swal-input4" placeholder="DUI" type="number" class="swal2-input"> </div> <div ><input id="swal-input4" placeholder="Usuario" class="swal2-input"> </div> </div>' +
            '<div ><div ><input id="swal-input1" placeholder="Contraseña" type="password" class="swal2-input"></div></div>' +

            '<div ><div ><br><select class="form-select" aria-label="Categorias"><option selected>Estado</option><option value="1">Activo</option><option value="2">Inactivo</option><option value="3">Baneado</option></select></div></div>',
        showconfirmButton: true,
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            /* return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                document.getElementById('swal-input3').value,
                document.getElementById('swal-input4').value
            ] */
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const product = result.value;
            // Hacer algo con los valores del producto (por ejemplo, enviarlos al servidor)
            Swal.fire({
                title: 'Cliente agregado',
                icon: 'success'
            });
        }
    });
}

//Alerta para Actualizar los Clientes
function openUpdate() {
    const { value: formValues } = Swal.fire({

        title: 'Desea Actualizar el Cliente?',
        width: "400px",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "green",
        html:
            //inputs para actualizar los clientes
            '<div class="><input id="swal-input1" placeholder="Nombres" class="swal2-input"></div> <div class="col"><input id="swal-input2" placeholder="Apellidos" class="swal2-input"></div></div>' +

            '<div class="row"><div class="col"><input id="iemail" type="email" placeholder="Correo" class="swal2-input"></div><div class="col"><input id="swal-input4" placeholder="DUI" type="number" class="swal2-input"> </div> <div class="col"><input id="swal-input4" placeholder="Usuario" class="swal2-input"> </div> </div>' +
            '<div class="row"><div class="col"><input id="swal-input1" placeholder="Contraseña" type="password" class="swal2-input"></div></div>' +

            '<div class="row"><div class="col"><br><select class="form-select" aria-label="Categorias"><option selected>Estado</option><option value="1">Activo</option><option value="2">Inactivo</option><option value="3">Baneado</option></select></div></div>',
        showconfirmButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            /* return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                document.getElementById('swal-input3').value,
                document.getElementById('swal-input4').value
            ] */
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const product = result.value;
            // Hacer algo con los valores del producto (por ejemplo, enviarlos al servidor)
            Swal.fire({
                title: 'Cliente actualizado',
                icon: 'success'
            });
        }
    });
}

//Alerta para eliminar clientes
function openDelete() {
    Swal.fire({
        title: '¿Desea eliminar este Cliente?',
        width: "400px",
        /* Pregunta de seguridad para la eliminacion de un pedido----*/
        html:
            '<div><label for="input-name">El cliente seleccionado sera eliminado permanentemente</label></div>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "red",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            const product = result.value;
            // Hacer algo con los valores del pedido (por ejemplo, enviarlos al servidor)
            Swal.fire({
                title: 'Cliente eliminado',
                icon: 'success'
            });
        }
    });
}