document.addEventListener("DOMContentLoaded", function (event) {
    //Se ocupa axios para obtener la informacion de la api
    axios.get('http://localhost:443/api/count/categories').then(function (categories) {
        //declaramos la variables que ocuparemos
        //almacenamos los datos de la api en la variable data
        let data = categories.data, statusName = [], categoriesCount = [], categorie, status

        //navegamos con un for dentro del objeto data
        for (let i = 0; i < data.length; i++) {
            //obtenemos el atributo count del objeto
            categorie = data[i].count
            //enviamos el dato count al arreglo categorieCount
            categoriesCount.push(categorie)
            //obtenemos el atrbuto _id del objeto
            status = data[i]._id
            //enviamos el datp _id al arreglo categorieName
            statusName.push(status)
        }   

        console.log(categoriesCount)

        //declaramos una constante donde ubicaremos al canvas 
        const CATEGORIES_EXISTS = document.getElementById('categoriesExists')

        //generamos el chart
        new Chart(CATEGORIES_EXISTS, {
            type: 'doughnut',
            data: {
                //enviamos el arreglo categorieName que llenamos con el for
                labels: statusName,
                datasets: [{
                    label: 'Categorias de productos',
                    //enviamos el arreglo categorieCount que llenamos con el for
                    data: categoriesCount,
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