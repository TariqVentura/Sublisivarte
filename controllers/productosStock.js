document.addEventListener("DOMContentLoaded", function (event) {
    // se ocupa axios para obtener la informacion de la api
    axios.get('http://localhost:443/api/count/stock').then(function (stock) {
        //declaramos la variables que ocuparemos
        //alamcenamos los datos de la api en la variable data
        let data = stock.data, productName = [], stockCount = [], count, name

        //navegamos con un for dentro del objeto data
        for (let i = 0; i < data.length; i++) {
            //obtenemos el atributo count del objeto
            count = data[i].count
            //enviamos el dato count al arreglo categorieCount
            stockCount.push(count)
            //obtenemos el atrbuto _id del objeto
            name = data[i]._id
            //enviamos el datp _id al arreglo categorieName
            productName.push(name)
        }

        //declaramos una constante donde ubicaremos al canvas 
        const PRODUCT_STOCK = document.getElementById('stockProducts')

        //generamos el chart
        new Chart(PRODUCT_STOCK, {
            type: 'doughnut',
            data: {
                //enviamos el arreglo categorieName que llenamos con el for
                labels: productName,
                datasets: [{
                    label: 'Cantidad de Productos por Categoria',
                    //enviamos el arreglo categorieCount que llenamos con el for
                    data: stockCount,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }) 
})
