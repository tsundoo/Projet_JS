import { fetchProducts} from './tools.js'


// afficher les produits
const products = await fetchProducts();
console.log(products)

// a foreach loop to display the data in the DOM 
products.forEach((element) => {
    let myHtml = `<a href="./product.html?id=${element._id}">
        <article>
        <img src="${element.imageUrl}" alt="${element.altTxt}">
        <h3 class="productName">${element.name}</h3>
        <p class="productDescription">${element.description}</p>        
        </article>
      </a>`;
      
    document.getElementById("items").innerHTML += myHtml;
});

