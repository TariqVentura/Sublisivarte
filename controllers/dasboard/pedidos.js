function openCreate() {
    const { value: formValues } = Swal.fire({

        title: 'Crear Pedido',
        width: "35%",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#6384AA",
        html:
            '<div class="row"> <div class="col"><input id="swal-input1" placeholder="N° Factura" class="swal2-input" readonly></div> <div class="col"><br><h6>Fecha del pedido<h6><input id="swal-input2" type="date" placeholder="Fecha del pedido" class="swal2-input"></div></div>' +

            '<div class="row"><div class="col"><input id="swal-input3" placeholder="Cliente" class="swal2-input"></div><div class="col">'+

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