module.exports = {
    formate: 'Letter',
    orientation: 'portrait',
    border: '15mm',
    header: {
        height: '15mm',
        contents: '<h4 style=" color: red;font-size:20;font-weight:800;text-align:center;">REPORTE GENERAL DE PRODUCTOS</h4>'
    },
    footer: {
        height: '20mm',
        contents: {
            first: '1',
            2: 'Second page',
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
            last: 'Last Page'
        }
    }
}