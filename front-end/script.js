/*Génération de l'URL de l'API selon le choix de produit à vendre
******************************************************************/

const productSelect = "furniture"  //Au choix entre : "cameras" - "furniture" - "teddies"
const APIURL = "http://localhost:3000/api/" + productSelect + "/";

//Variable pour l'id du produit pour permettre un tri dans l'API

let idProduct = "";

/*Appel de l'API
**********************************************/

provideProducts = () =>{
	return new Promise((resolve) =>{
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == XMLHttpRequest.DONE && this.status == 200) 
			{
				resolve(JSON.parse(this.responseText));
				console.log("Administration : connection API ok");

				//L'appel est réussi : alors on supprime les messages d'erreur
				error = document.getElementById("error");
				//On supprime le message d'erreur s'il existe
				if(error){
					error.remove();
				}
			}else{
				console.log("Administration : ERROR connection API");
			}
		}
		request.open("GET", APIURL + idProduct);
		request.send();
	});
};

/*Création des conteneurs HTML pour les produits,
 après appel de l'API
**********************************************/

	//Fonction d'affichage de la liste des produits en vente(page index).
	async function allProductsList(){
		const products = await provideProducts();

		//Création de la div accueillant la liste des produits
		let listProducts = document.createElement("div")
		listProducts.setAttribute("class", "list-products");
		//Ajout de la div dans le HTML en tant qu'enfant de la section des produits
		let main = document.getElementById("section_products");
		main.appendChild(listProducts);

		//Pour chaque produit de l'API on créé l'encadré HTML de ce produit
		products.forEach((product) =>
		{ 
			
			//Création de trois div et les élément img,h2,p et a pour le lien
			let productContent = document.createElement("div");
			let productContentImg = document.createElement("div");
			let productContentInfo = document.createElement("div");
			let productImage = document.createElement("img");
			let productName = document.createElement("h2");
			let productPrice = document.createElement("p");
			let productLink = document.createElement("a");
			

			//Ajout des attributs aux balises pour la création du style via sass
			productContent.setAttribute("class", "list-products__block");
			productContentImg.setAttribute("class", "list-products__block--img");
			productContentInfo.setAttribute("class", "list-product__block--info");
			productImage.setAttribute("src", product.imageUrl);
			productImage.setAttribute("alt", "image du produit"); 
			productLink.setAttribute("href", "product.html?id=" + product._id);

			//Block conteneur en flex
			//Block gauche comprend l'image du produit
			//Bloc droit comprend le nom/prix/le lien du produit
			listProducts.appendChild(productContent);
			productContent.appendChild(productContentImg);
			productContentImg.appendChild(productImage);
			productContent.appendChild(productContentInfo);
			productContentInfo.appendChild(productName);
			productContentInfo.appendChild(productPrice);
			productContentInfo.appendChild(productLink);

			//Déterminer le contenu des balises h2,p et a
			productName.textContent = product.name;
			productPrice.textContent = product.price / 100 + " euros";
			productLink.textContent = "Voir le produit";
		});
};
allProductsList();