import { get, has, fetchProducts, notifyAndRedirect, store } from './tools.js';

let html = "";
let totalPrice = 0;
let totalQty = 0;



    const products = await buildCompleteList();
    displayProducts(products);
    displayTotal(products);
    listenForQtyUpdate(products);
    listenForDeletion(products);


//liste des produits
async function buildCompleteList() {
    const cart = get('products')
    const all = await fetchProducts();
    const list = [];
    cart.forEach(item => {
        const findNeedProduct = all.find(p => p._id == item.id)
        const product = {
            ...findNeedProduct
        };
        product.qty = item.qty;
        product.color = item.color;
        list.push(product)

    });
    return list;
}


// afficher produit dans le panier 
function displayProducts(products) {
    products.forEach((element) => {
        document.getElementById("cart__items").innerHTML += ` <article class="cart__item" data-id="${element._id}" data-color="${element.color}">
        <div class="cart__item__img">
          <img src="${element.imageUrl}" alt="${element.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${element.name}</h2>
            <h3>${element.color}</h3>
            <p>${element.description}</p>
            <p>${element.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${element.qty}>
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem" >Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;


    })
}

// total du prix et de la quantité 
function displayTotal(products) {
    products.forEach((element) => {

        totalPrice += element.price * element.qty;
        document.getElementById("totalPrice").innerHTML = totalPrice;

        totalQty += [1] * element.qty;
        document.getElementById("totalQuantity").innerHTML = totalQty;
    })
}

// changer quantité d'un élement 
function listenForQtyUpdate(products) {
    products.forEach((product) => {
        const input = document.querySelector(`article[data-id="${product._id}"][data-color="${product.color}"] .itemQuantity`)
        input.addEventListener('input', (e) => {
            const qty = e.target.value;
            const cart = get('products');
            const item = cart.find(a => a.id == product._id && a.color == product.color)
            item.qty = Number(qty);
            store('products', cart)
            location.reload();
        })
    });

}

// supprimer un element 
function listenForDeletion(products) {
    products.forEach((product) => {
        const input = document.querySelector(`article[data-id="${product._id}"][data-color="${product.color}"] .deleteItem`)
        input.addEventListener('click', (e) => {
            const cart = get('products');
            const index = cart.findIndex(a => a.id == product._id && a.color == product.color);
            cart.splice(index, 1);
            store('products', cart);
            location.reload();
        })
    });

}


// the form inputs
const form = document.querySelector('.cart__order__form');  
const firstNameEl = document.getElementById('firstName');
const lastNameEl = document.getElementById('lastName');
const addressEl = document.getElementById('address');
const cityEl = document.getElementById('city');
const emailEl = document.getElementById('email');


// envoie des données dans le formulaire 
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError(firstNameEl);
    if (!isFirstNameValid()) {
        showError(firstNameEl, 'Le prénom doit comporter au moins 2 caractères')
        return;
    }
    hideError(lastNameEl);
    if (!isLastNameValid()) {
        showError(lastNameEl, 'Le nom doit comporter au moins 2 caractères')
        return;
    }
    hideError(addressEl);
    if (!isAddressValid()) {
        showError(addressEl, "L'adresse doit comporter au moins 5 caractères")
        return;
    }
    hideError(cityEl);
    if (!isCityValid()) {
        showError(cityEl, "L'adresse doit comporter au moins 3 caractères")
        return;
    }
    hideError(emailEl);
    if (!isMailValid()) {
        showError(emailEl, "L'adresse doit comporter au moins 3 caractères")
        return;
    }

    // envoie vers le serveurs
    const payload = {
        contact: {
            'firstName': 'test',
            'lastName': 'test',
            'address': 'test',
            'city': 'test',
            'email': 'test@gmail.com'
        },
        products: get('products').map(a => a.id),

    }
    const res = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-type": "application/json"
            },
        }).then(a => a.json())
        .then((data) => {
            localStorage.clear();
            let confirmationUrl = "./confirmation.html?id=" + data.orderId;
            notifyAndRedirect('Merci pour votre commande', window.location.href = confirmationUrl);
        })




})
// verification des informations dans l'input 
function isFirstNameValid() {
    const firstName = firstNameEl.value;

    if (firstName.trim(' ').length < 3) {
        return false
    }
    return true
}

function isLastNameValid() {
    const lastName = lastNameEl.value;

    if (lastName.trim(' ').length < 3) {
        return false
    }
    return true
}

function isAddressValid() {
    const address = addressEl.value;

    if (address.trim(' ').length < 5) {
        return false
    }
    return true
}

function isCityValid() {
    const city = cityEl.value;

    if (city.trim(' ').length < 3) {
        return false
    }
    return true
}

function isMailValid() {
    const mail = emailEl.value;

    if (mail.trim(' ').length < 6) {
        return false
    }
    return true
}

//  empecher qu'un message d'erreur ne soit la avant
function hideError(el) {
    el.nextElementSibling.innerText = ''
}

// Afficher l'erreur sous l'input
function showError(el, msg) {
    el.nextElementSibling.innerText = msg
}