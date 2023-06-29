function seacrhProduct() {
    location.href = 'http://localhost:443/products/' + document.getElementById('seacrhProduct').value 
}

function searchComment() {
    location.href = 'http://localhost:443/comments/' + document.getElementById('seacrhComment').value 
}

function searchUser() {
    location.href = 'http://localhost:443/users/' + document.getElementById('seacrhUser').value 
}

function viewsProducts() {
    location.href = 'http://localhost:443/views/products/' + document.getElementById('searchViewProduct').value
}

function searchCategorie() {
    location.href = 'http://localhost:443/categories/' + document.getElementById('searchCategorie').value
}

function searchOrders() {
    location.href = 'http://localhost:443/views/pedidos/' + document.getElementById('seacrhOrder').value
}