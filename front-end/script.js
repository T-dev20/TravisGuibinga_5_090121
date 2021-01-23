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

			//Les trois div précédentes reçoivent les autres éléments comme enfants
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

/*L'utilisateur à besoin d'un panier dans le localStorage de son navigateur
On vérifie que le panier existe dans le localStorage, sinon on le crée et on l'envoie dans 
le localStorage au premier chargement du site quelque soit la page*/

if(localStorage.getItem("basketUser")){
	console.log("Administration : Panier présent dans le localStorage");
}else{
	console.log("Administration : Panier non présent dans le localStorage. Créons-le!");
	let basketInit = [];
	localStorage.setItem("basketUser", JSON.stringify(basketInit));
}

//Récupération du panier et transformation des données en object Js 
let userBasket = JSON.parse(localStorage.getItem("basketUser"));


/*Affichage de la page produit, avec présentation
du produit sélectionné.
*************************************************/

async function productDetails (){
	//Collecter l'URL du produit après le "?id=" pour le récupérer sur l'API
	idProduct = location.search.substring(4);
	const productSelected = await provideProducts();
	console.log("Administration : Vous êtes sur la page du produit id_" + productSelected._id);
	
	//Remplissage de la fiche produit
    document.getElementById("productImg").setAttribute("src", productSelected.imageUrl);
    document.getElementById("productName").innerHTML = productSelected.name;
    document.getElementById("product-description").innerHTML = productSelected.description;
    document.getElementById("productPrice").innerHTML = productSelected.price / 100 + " euros";

	//Pour chaque verni on crée une option permettant à l'utilisateur de faire son choix
	productSelected.varnish.forEach((product)=>{
    		let optionProduct = document.createElement("option");
    		document.getElementById("optionSelect").appendChild(optionProduct).innerHTML = product;
    	});
}


/*Fonction ajouter le produit au panier de l'utilisateur
 *******************************************************/
function addToBasket(){
	//Écoute de l'évènement clic du btn pour mettre le produit dans le panier
		var addProd = document.getElementById("addProductToBasket");
		var countProd = document.getElementById("prodNumber");
		addProd.addEventListener('click', () => {
			cartCount();
		})

	function cartCount(){
			let prdCount = localStorage.getItem('counterNum');
			//valeur du conterNum passé en type 'Number'  
			prdCount = parseInt(prdCount);
			//Si la valeur de prdCount existe,alors on ajoute 1 dans le localStorage et le compteur visible
			//sinon on crée un paire clé/valeur initialisée à 1
			if(prdCount){
				localStorage.setItem('counterNum', prdCount + 1);
				countProd.textContent = prdCount + 1;
			}else{
				localStorage.setItem('counterNum', 1);
				countProd.textContent = prdCount = 1;
			}
			
};
addPanier() ;
}

/*Fonction pour ajout de produit au panier et renvoie de l'historique en Objet Js*/
function addPanier() {
  	//Au clic de l'user pour mettre le produit dans le panier
  	let inputBuy = document.getElementById("addProductToBasket");
  	inputBuy.addEventListener("click", async function() {
  		const prod = await provideProducts();
  	//Récupération du panier dans le localStorage et ajout du produit dans le panier avant revoit dans le localStorage
  	userBasket.push(prod);
  	localStorage.setItem("basketUser", JSON.stringify(userBasket));
  	console.log("Administration : le produit a été ajouté au panier");
  });
  };


function recapProducts() {
	//On vérifie s'il y a au moins un prduit dans le panier
    if(JSON.parse(localStorage.getItem("basketUser")).length > 0){
      //S'il n'est pas vide on supprime le message et on créé le tableau récapitulatif
      document.getElementById("emptyBasket").remove();

      //Création de la structure principale du tableau  
      let facture = document.createElement("table");
      let firstRowTable = document.createElement("tr");
      let columnName = document.createElement("th");
      let columnPriceUnit = document.createElement("th");
      let colRemoveProd = document.createElement("th");
      let rowTotal = document.createElement("tr");
      let columnRefTotal = document.createElement("th");
      let colPriceTotal = document.createElement("td");

      //Placement de la structure du tableau dans la page panier
      let factureSection = document.getElementById("basket-resume");
      factureSection.appendChild(facture);
      facture.appendChild(firstRowTable);
      firstRowTable.appendChild(columnName);
      columnName.textContent = "Nom du produit";
      firstRowTable.appendChild(columnPriceUnit);
	  columnPriceUnit.textContent = "Prix du produit";
	  

	  //Pour chaque produit du panier, on créé une ligne avec le nom et le prix
      //Initialisation du compteur pour l'incrémentation de l'id des lignes pour chaque produit
      let i = 0;
      
      JSON.parse(localStorage.getItem("basketUser")).forEach((product)=>{
        //Création de la ligne
        let ligneProduct = document.createElement("tr");
        let nameProduct = document.createElement("td");
        let priceUnitProduct = document.createElement("td");
        let iconRemoving = document.createElement("i");

        //Attribution des class pour le css
        ligneProduct.setAttribute("id", "product " + i++);
        iconRemoving.setAttribute("id", "remove " + i++);
        iconRemoving.setAttribute('class', "fas fa-trash-alt annulerproduct");
        //Pour chaque produit on écoute l'évènement clic sur l'icone de la corbeille pour supprimer ce produit
        //bind permet de garder l'incrementation du i qui représente l'index du panier au moment de l'écoute de l'event
        //annulerProduit L233
        iconRemoving.addEventListener('click', removeProduct.bind(i));
        i++;

        //Insertion des produits sélectionnés dans le tableau
        facture.appendChild(ligneProduct);
        ligneProduct.appendChild(nameProduct);
        ligneProduct.appendChild(priceUnitProduct);
        ligneProduct.appendChild(iconRemoving);

        //Contenu des lignes
        nameProduct.innerHTML = product.name;
        priceUnitProduct.textContent = product.price / 100 + " €";
    });
};
}
