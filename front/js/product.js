import { get, has, store, notifyAndRedirect } from './tools.js';

const id = getId();
// to display the product been fetch through id
const product = await fetchProduct(id);
console.log(product);


// id du produit dans l'url 
function getId() {
    const url = new URL(location.href)
    return url.searchParams.get("id");
}

// call api
async function fetchProduct(id) {
    const url = "http://localhost:3000/api/products/" + id;

    try {
        const response = await fetch(url);
        return await response.json();

    } catch (error) {
        console.log(error);
    }
}




function listen(product) {

    document.getElementById("addToCart").addEventListener("click", () => {
        const qty = document.getElementById("quantity").value;
        const color = document.getElementById("colors").value;


        if (qty <= 0 || qty > 100) {
            alert('Merci de choisir une quantité entre 1 et 100')
            return;
        }
        if (color === '') {
            alert('Merci de choisir une couleur')
            return;
        }

        let products = [];

        // Le panier est vide

        if (!has("products")) {
            products.push({
                id: product._id,
                color: color,
                qty: qty,
            })

            store("products", products);
            notifyAndRedirect('Votre produit est bien ajouté , redirection vers la page d acceuil', "index.html");
            return;
        }

        // le panier contient deja des produits 
        // produit déjà existant 
        products = get("products");
        const productExists = products.find(a => a.id == product._id && a.color == color)        

        // le produit avec cette couleur existe deja

        if (productExists) {
            productExists.qty = Number(productExists.qty) + Number(qty);
        } else {
            products.push({
                id: product._id,
                color: color,
                qty: qty,
            })

        }

        store("products", products);
        notifyAndRedirect('Votre produit est bien ajouté , redirection vers la page d acceuil', "index.html");
        return;
    })
}


// afficher les informations produits 
async function display(product) {

    document.querySelector('.item__img').innerHTML =  `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById('title').textContent = product.name;
    document.getElementById('price').textContent = product.price;
    document.getElementById('description').textContent = product.description;

    // using a loop to display the multiple colors
    const colorsSelect = document.getElementById("colors");
    product.colors.forEach(color => {
        let option = document.createElement("option");
        option.value = color;
        option.innerText = color;
        colorsSelect.appendChild(option);
    })

}

listen(product);
display(product);

