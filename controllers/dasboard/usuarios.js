function openCreate() {
    const { value: formValues } = Swal.fire({

        title: 'Crear Usuario',
        width: "35%",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#6384AA",
        html:
            '<div class="row"> <div class="col"><input id="swal-input1" placeholder="Nombres" class="swal2-input"></div> <div class="col"><input id="swal-input2" placeholder="Apellidos" class="swal2-input"></div></div>' +

            '<div class="row"><div class="col"><input id="iemail" type="email" placeholder="Correo" class="swal2-input"></div><div class="col"><input id="swal-input4" placeholder="Usuario" class="swal2-input"> </div></div>' +
            '<div class="row"><div class="col"><input id="swal-input1" placeholder="Contraseña" type="password" class="swal2-input"></div></div>'+                            

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

function openCreate3() {
    Swal.fire({
        title: '¿Desea eliminar este usuario?',
        width: "30%",
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
            title: 'Usuario eliminado',
            icon: 'success'
          });
        }
      });
}