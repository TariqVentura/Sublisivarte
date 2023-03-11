function openCreate() {
    const { value: formValues } = Swal.fire({

        title: 'Crear Cliente',
        width: "40%",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#9e7676",
        html:
            '<div class="row"> <div class="col"><input id="swal-input1" placeholder="Nombres" class="swal2-input"></div> <div class="col"><input id="swal-input2" placeholder="Apellidos" class="swal2-input"></div></div>' +

            '<div class="row flex-nowrap"><div class="col"><br><br><img src="https://img.icons8.com/sf-black-filled/32/null/overview-pages-2.png"/><input id="swal-input3" placeholder="Descripción" class="swal2-input" ></div><div class="col"><br><br><img src="https://img.icons8.com/ios-filled/30/null/idea--v1.png"/><input id="swal-input4" placeholder="Cantidad" class="swal2-input"> </div></div>' +

            '<div class="row"><div class="col"><br><br><select class="form-select" aria-label="Categorias"><option selected>Categorias</option><option value="1">Refrigeradores</option><option value="2">Cocinas</option><option value="3">Lavadoras</option></select></div><div class="col"><br><br><select class="form-select" aria-label="Marcas"><option selected>Marcas</option><option value="1">Sony</option><option value="2">Samsung</option><option value="3">Edragas</option></select> </div></div>' +

            '<br><select class="form-select" aria-label="Estado"><option selected>Estado</option><option value="1">Existente</option><option value="2">Inexistente</option>',
        input: 'file',
        inputAttributes: {
            'accept': 'image/*',
            'aria-label': 'Seleccionar Imagen del producto'
        },
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