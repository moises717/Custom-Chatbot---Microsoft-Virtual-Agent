const productContainer = document.getElementById("productContent");
let loader = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;

document.addEventListener("DOMContentLoaded", () => {
	fetchProducts();
});
function fetchProducts() {
	productContainer.innerHTML = loader;
	fetch("https://fakestoreapi.com/products")
		.then((response) => response.json())
		.then((products) => {
			productContainer.innerHTML = "";
			products.forEach((product) => {
				createProduct(product);
			});

			var tooltipTriggerList = [].slice.call(document.querySelectorAll(".tt"));
			tooltipTriggerList.map(function (tooltipTriggerEl) {
				return new bootstrap.Tooltip(tooltipTriggerEl);
			});
		});
}

function createProduct(product) {
	productContainer.innerHTML += `
    <div class="col-md-6 item">
    <div class="product py-4" > <span class="off bg-success">USD ${product.price}</span>
        <div class="text-center"> <img class="imgp" src="${product.image}" width="200"> </div>
        <div class="about text-center">
        <span class="tt" data-bs-toggle="tooltip" data-bs-placement="top" title="SOLICITAR EN EL CHATBOT">
        <h5 class="child" >${product.title}</h5>
        </span>
        <small>${product.description}</small>
        </div>
    </div>
</div>`;
}
