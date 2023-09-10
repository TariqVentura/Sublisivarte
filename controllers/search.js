function seacrhProduct() {
    let product = document.getElementById('seacrhProduct').value 
    location.href = 'http://localhost:443/products/' + product
}

function searchComment() {
    let comment = document.getElementById('seacrhComment').value 
    location.href = 'http://localhost:443/comments/' + comment
}

function searchUser() {
    let user = document.getElementById('seacrhUser').value 
    location.href = 'http://localhost:443/users/' + user
}
    

function viewsProducts() {
    let product = document.getElementById('searchViewProduct').value
    location.href = 'http://localhost:443/views/products/' + product
}

function searchCategorie() {
    let category = document.getElementById('searchCategorie').value
    location.href = 'http://localhost:443/categories/' + category
}
    

function searchOrders() {
    let order = document.getElementById('seacrhOrder').value
    location.href = 'http://localhost:443/views/pedidos/' + order
}