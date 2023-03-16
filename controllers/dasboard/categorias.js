function openCreate() {
    const { value: formValues } = Swal.fire({

        title: 'Crear categoria',
        width: "35%",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#6384AA",
        html:
            '<div class="row"> <div class="col"><input id="swal-input1" placeholder="Categoria" class="swal2-input"></div> <div class="col"><br><input id="swal-input2" placeholder="Tipo de categoria" class="swal2-input"></div></div>' +

            '<div class="row"><div class="col"><br><select class="form-select" aria-label="Categorias"><option selected>Estado</option><option value="1">Activo</option><option value="2">Inactivo</option><option value="3">Baneado</option></select></div></div><br>',
        showconfirmButton: true,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                document.getElementById('swal-input3').value,
                document.getElementById('swal-input4').value                
            ]
        }
    })

    if (formValues) {
        Swal.fire(JSON.stringify(formValues))
    }
}

function editarcategoria() {
    Swal.fire({
        title: 'Editar categoria',
        width: "30%",
        /* Campos del modal editar que seran enviados*/
        html:
            '<div class="row"> <div class="col"><input id="swal-input1" placeholder="Categoria" class="swal2-input"></div> <div class="col"><br><input id="swal-input2" placeholder="Tipo de categoria" class="swal2-input"></div></div>' +

            '<div class="row"><div class="col"><br><select class="form-select" aria-label="Categorias"><option selected>Estado</option><option value="1">Activo</option><option value="2">Inactivo</option><option value="3">Baneado</option></select></div></div><br>',
        showCancelButton: true,
        confirmButtonColor: "green",
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            return {
                name: document.getElementById('swal-input1').value,
                date: document.getElementById('swal-input2').value,
                client: document.getElementById('swal-input3').value,
                stock: document.getElementById('input-stock').value,
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const product = result.value;
            // Hacer algo con los valores del producto (por ejemplo, enviarlos al servidor)
            Swal.fire({
                title: 'Categoría actualizada',
                icon: 'success'
            });
        }
    });
}

function eliminarcategoria() {
    Swal.fire({
        title: '¿Desea eliminar esta categoría?',
        width: "30%",
        /* Pregunta de seguridad para la eliminacion de un pedido----*/
        html:
          '<div><label for="input-name">La categoría seleccionada sera eliminada permanentemente</label></div>',
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
            title: 'Categpría eliminada',
            icon: 'success'
          });
        }
      });
}