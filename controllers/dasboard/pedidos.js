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

function editarpedido() {
    Swal.fire({
        title: 'Editar pedido',
        width: "30%",
        /* Campos del modal editar que seran enviados*/
        html:
            '<div class="row"> <div class="col"><input id="swal-input1" placeholder="N° Factura" class="swal2-input" readonly></div> <div class="col"><br><h6>Fecha del pedido<h6><input id="swal-input2" type="date" placeholder="Fecha del pedido" class="swal2-input"></div></div>' +

            '<div class="row"><div class="col"><input id="swal-input3" placeholder="Cliente" class="swal2-input"></div><div class="col">'+

            '<div class="row"><div class="col"><br><select class="form-select" aria-label="Estado del pedido"><option selected>Estado</option><option value="1">Activo</option><option value="2">Inactivo</option><option value="3">Baneado</option></select></div></div><br>',
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
                title: 'Producto editado',
                icon: 'success'
            });
        }
    });
}

function eliminarpedido() {
    Swal.fire({
        title: '¿Desea eliminar este pedido?',
        width: "30%",
        /* Pregunta de seguridad para la eliminacion de un pedido----*/
        html:
          '<div><label for="input-name">El pedido seleccionado sera eliminado permanentemente</label></div>',
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
            title: 'Usuario eliminado',
            icon: 'success'
          });
        }
      });
}

function generarPDF() {
    // Crea un objeto jsPDF
    const doc = new jsPDF();
  
    // Selecciona la tabla y la convierte en un string de HTML
    const table = document.querySelector('table');
    const tableHtml = table.outerHTML;
  
    // Genera el informe PDF a partir del string de HTML
    doc.fromHTML(tableHtml, 15, 15);
  
    // Guarda el informe PDF
    doc.save('informe.pdf');
  }