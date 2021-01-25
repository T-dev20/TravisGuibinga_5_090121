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
};

//Tableau et objet demandé par l'API pour la commande
  	let contact;
	let productToAPI = [];
	  
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
/*function addToBasket(){
	//Écoute de l'évènement clic du btn pour mettre le produit dans le panier
		var addProd = document.getElementById("addProductToBasket");
		//var countProd = document.getElementById("prodNumber");
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
}*/

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

/*Page panier
**********************************************/

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
	 // let columnRemove = document.createElement("td");
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
		// let colRemoveProd = document.createElement("i");
		let colRemoveProd = document.createElement("button");

        //Attribution des class pour le css
        ligneProduct.setAttribute("id", "product"+i);
        colRemoveProd.setAttribute("id", "remove"+i);
        // colRemoveProd.setAttribute('class', "fas fa-trash-alt annulerproduct");
        //Pour chaque produit on écoute l'évènement clic sur l'icone de la corbeille pour supprimer ce produit
        //bind permet de garder l'incrementation du i qui représente l'index du panier au moment de l'écoute de l'event
        //removeProduct => L249
        colRemoveProd.addEventListener('click', removeProduct.bind(i));
        i++;

        //Insertion des produits sélectionnés dans le tableau
        facture.appendChild(ligneProduct);
        ligneProduct.appendChild(nameProduct);
        ligneProduct.appendChild(priceUnitProduct);
        ligneProduct.appendChild(colRemoveProd);

		//Contenu des lignes
		colRemoveProd.textContent = 'supprimer';
        nameProduct.innerHTML = product.name;
        priceUnitProduct.textContent = product.price / 100 + " €";
	});
	
		//Dernière ligne du tableau : Total
		facture.appendChild(rowTotal);
		rowTotal.appendChild(columnRefTotal);
		columnRefTotal.textContent = "Total à payer";
		rowTotal.appendChild(colPriceTotal);
		colPriceTotal.setAttribute("id", "sommeTotal");

		//Calcule de la somme totale à régler
		let totalPaye = 0;
		JSON.parse(localStorage.getItem("basketUser")).forEach((product)=>{
			totalPaye += product.price / 100;
		});

		//Affichage du prix total à régler
		console.log("Administration : " + totalPaye);
		document.getElementById("sommeTotal").textContent = totalPaye + " €";
};
}

removeProduct = (i) => {
		console.log("Administration : Enlever le produit à l'index " + i);
		//recupérer le array
		userBasket.splice(i, 1); 
		console.log("Administration : " + basketUser);
		//On vide le localstorage
		localStorage.clear();
		console.log("Administration : localStorage vidé");
		//mettre à jour le localStorage avec le nouveau panier
		localStorage.setItem('basketUser', JSON.stringify(userBasket));
		console.log("Administration : localStorage mis à jour");
		//relancer la création de la foncton recapProducts
		window.location.reload();
};

/*function removeProduct(name) {
	var basket = JSON.parse(localStorage.getItem("basketUser")).length;
	for (let i = 0; i < basket; i+= 1) {
		if (basket[i].name === name) {
			basket.splice(i, 1)
			return name;
		}
	}
		
}*/

/*Formulaire et vérification de l'etat du panier
*************************************************/

  //vérifie les inputs du formulaire
  checkInput = () =>{
    //Controle Regex
    let checkString = /[a-zA-Z]/;
    let checkNumber = /[0-9]/;
    //Source pour vérification email => emailregex.com
    let checkMail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/y;
    let checkSpecialCharacter = /[§!@#$%^&*(),.?":{}|<>]/;

    //message fin de controle
    let checkMessage = "";

    //Récupération des inputs
    let formNom = document.getElementById("formNom").value;
    let formPrenom = document.getElementById("formPrenom").value;
    let formMail = document.getElementById("formMail").value;
    let formAdresse = document.getElementById("formAdresse").value;
    let formVille = document.getElementById("formVille").value;


      //tests des différents input du formulaire
        //Test du nom => aucun chiffre ou charactère spécial permis
        if(checkNumber.test(formNom) == true || checkSpecialCharacter.test(formNom) == true || formNom == ""){
        	checkMessage = "Vérifier/renseigner votre nom";
        }else{
        	console.log("Administration : Nom ok");
        };
        //Test du prénom => aucun chiffre ou charactère spécial permis
        if(checkNumber.test(formPrenom) == true || checkSpecialCharacter.test(formPrenom) == true || formPrenom == ""){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre prénom";
        }else{
        	console.log("Administration : Prénom ok");
        };
        //Test du mail selon le regex de la source L292
        if(checkMail.test(formMail) == false){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre email";
        }else{
        	console.log("Administration : Adresse mail ok");
        };
        //Test de l'adresse => l'adresse ne contient pas obligatoirement un numéro de rue mais n'a pas de characteres spéciaux
        if(checkSpecialCharacter.test(formAdresse) == true || formAdresse == ""){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre adresse";
        }else{
        	console.log("Administration : Adresse ok");
        };
        //Test de la ville => aucune ville en France ne comporte de chiffre ou charactères spéciaux
        if(checkSpecialCharacter.test(formVille) == true && checkNumber.test(formVille) == true || formVille == ""){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre ville"
        }else{
        	console.log("Administration : Ville ok")
        };
        //Si un des champs n'est pas bon => message d'alert avec la raison
        if(checkMessage != ""){
        	alert("Il est nécessaire de :" + "\n" + checkMessage);
        }
        //Si tout est ok construction de l'objet contact => a revoir
        else{
        	contact = {
        		firstName : formNom,
        		lastName : formPrenom,
        		address : formAdresse,
        		city : formVille,
        		email : formMail
        	};
        	return contact;
        };
	};
	
	//Vérification du panier
	function checkBasket() {
		//Vérifier qu'il y ai au moins un produit dans le panier
		let statuBasket = JSON.parse(localStorage.getItem("basketUser"));
		//Si le panier est vide ou null (suppression localStorage par)=>alerte
		if(statuBasket == null){
			//Si l'utilisateur à supprimer son localStorage statuBasket sur la page basket.html et qu'il continue le process de commande
			alert("Il y a eu un problème avec votre panier, une action non autorisée a été faite. Veuillez recharger la page pour la corriger");
			return false
		}else if(statuBasket.length < 1 || statuBasket == null){
			console.log("Administration: ERROR => le localStorage ne contient pas de panier")
			alert("Votre panier est vide");
			return false;
		}else{
			console.log("Administration : Le panier n'est pas vide")
			//Si le panier n'est pas vide on rempli le productToAPI(L105) envoyé à l'API
			JSON.parse(localStorage.getItem("basketUser")).forEach((product) =>{
				productToAPI.push(product._id);
			});
			console.log("Administration : Le tableau "+ productToAPI + " sera envoyé à l'API")
			return true;
		}
	};
