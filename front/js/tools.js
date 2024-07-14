// function to get the data from the localStorage 
function get(key) {
    if (!has(key)) {
        throw new Error('this key does not exists')
    }
    return JSON.parse(localStorage.getItem(key));
}

// function to check this data exists in the localStorage
function has(key) {
    if (localStorage.getItem(key)) {
        return true;
    }
    return false;
}

// function to store the data in the localStorage
function store(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


// function to to notify and change the destination 
function notifyAndRedirect(message, destination) {
    alert(message)
    location.href = destination;
}

// function to fetch the data through API
async function fetchProducts() {
    const url = "http://localhost:3000/api/products";

    try {
        const response = await fetch(url);
        console.log(response.status);
        return await response.json();

    } catch (error) {
        console.log(error);
    }
}

// exporting the function that are created 
export { get, has, fetchProducts, store, notifyAndRedirect };