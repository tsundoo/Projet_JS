const params = new URL(document.location).searchParams;
const orderId = params.get("id");

document.getElementById("orderId").textContent = orderId;