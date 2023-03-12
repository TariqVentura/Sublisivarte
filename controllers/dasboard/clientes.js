function openCreate() {
    const { value: formValues } = Swal.fire({

        title: 'Crear Cliente',
        width: "30%",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#9e7676",
        html:
            '<div class="row"> <div class="col"><input id="swal-input1" placeholder="Nombres" class="swal2-input"></div> <div class="col"><input id="swal-input2" placeholder="Apellidos" class="swal2-input"></div></div>' +

            '<div class="row"><div class="col"><input id="iemail" type="email" placeholder="Correo" class="swal2-input"></div><div class="col"><input id="swal-input4" placeholder="DUI" type="number" class="swal2-input"> </div> <div class="col"><input id="swal-input4" placeholder="Usuario" class="swal2-input"> </div> </div>' +
            '<div class="row"><div class="col"><input id="swal-input1" placeholder="Contraseña" type="password" class="swal2-input"></div></div>'+                            

            '<div class="row"><div class="col"><br><select class="form-select" aria-label="Categorias"><option selected>Estado</option><option value="1">Activo</option><option value="2">Inactivo</option><option value="3">Baneado</option></select></div></div>',
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