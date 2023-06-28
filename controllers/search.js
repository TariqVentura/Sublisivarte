function seacrhProduct() {
    location.href = 'http://localhost:443/products/' + document.getElementById('seacrhProduct').value 
}

function searchComment() {
    location.href = 'http://localhost:443/comments/' + document.getElementById('seacrhComment').value 
}

function searchUser() {
    location.href = 'http://localhost:443/user/' + document.getElementById('seacrhUser').value 
}