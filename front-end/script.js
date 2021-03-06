/*Génération de l'URL de l'API selon le choix de produit à vendre
******************************************************************/

const productSelect = "furniture"  //Au choix entre : "cameras" - "furniture" - "teddies"
const APIURL = "http://localhost:3000/api/" + productSelect + "/";

//Variable pour l'id du produit pour permettre un tri dans l'API

let idProduct = "";


/*L'utilisateur a besoin d'un panier dans le localStorage de son navigateur
On vérifie que le panier existe dans le localStorage, sinon on le crée et on l'envoie dans 
le localStorage au premier chargement du site quelque soit la page*/

if(localStorage.getItem("basketUser")){
	console.log("Administration : Panier présent dans le localStorage");
}else{
	console.log("Administration : Panier non présent dans le localStorage. Créons-le!");
	let basketInit = [];
	localStorage.setItem("basketUser", JSON.stringify(basketInit));
};

	  
//Récupération du panier et transformation des données en object Js 
	let userBasket = JSON.parse(localStorage.getItem("basketUser"));

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
			optionProduct.setAttribute('value', product.varnish);
			document.getElementById("optionSelect").appendChild(optionProduct).innerHTML = product;
			
    	});
};

//Vérification du choix de l'option
checkOption = () => {
	let optionStatut = document.getElementById('optionSelect');
		if  (optionStatut.selectedIndex == -1 || optionStatut.selectedIndex < 1) {
			return false;
		} else {
			console.log("une option a été choisie");
			return true;
		}
};


/*Fonction pour ajout de produit au panier et renvoie de l'historique en Objet Js*/
addToBasket = () => {
  	//Au clic de l'user pour mettre le produit dans le panier
  	let inputBuy = document.getElementById("addProductToBasket");
  	inputBuy.addEventListener("click", async function() {
		if(checkOption() == true){
			const prod = await provideProducts();
			//Récupération du panier dans le localStorage et ajout du produit dans le panier avant revoit dans le localStorage
			userBasket.push(prod);
			localStorage.setItem("basketUser", JSON.stringify(userBasket));
			console.log("Administration : le produit a été ajouté au panier");
			alert("Cet article a été ajouté dans votre panier");
			location.reload();
 		}else{
			 alert("Veuillez choisir une option");
 		}
  });
  };


/*Fonction d'affichage du nbre de poduits sur l'icon du panier
**************************************************************/
function prodNumbers() {
  let prodNumber = document.getElementById("prodNumber");
  prodNumber.innerHTML = userBasket.length;
}

/*Page panier
**********************************************/

recapProducts = () =>{
	
	//On vérifie s'il y a au moins un prduit dans le panier
    if(userBasket.length > 0){
	
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
	  

	  //Boucle FOR pour affichage des articles dans le panier
     
      for (let i = 0; i<userBasket.length; i++) {
    
      //Création des lignes du tableau

      	let ligneProduct = document.createElement("tr");
        let nameProduct = document.createElement("td");
        let priceUnitProduct = document.createElement("td");
		let colRemoveProd = document.createElement("p");
		//let colRemoveProd = document.createElement("button");

		//Attribution des class ou Id
		ligneProduct.setAttribute("id", "product"+[i]);
		colRemoveProd.setAttribute("class", "suppression");
		colRemoveProd.innerHTML = 'supprimer';
		

		console.log(i);
		
		//Supprimer un produit du panier. removeProduct => L244
		colRemoveProd.addEventListener("click", () => {removeProduct(i);})
   
       //Insertion des produits sélectionnés dans le tableau
        facture.appendChild(ligneProduct);
        ligneProduct.appendChild(nameProduct);
        ligneProduct.appendChild(priceUnitProduct);
        ligneProduct.appendChild(colRemoveProd);

		//Contenu des lignes
		//colRemoveProd.textContent = 'supprimer';
        nameProduct.textContent = userBasket[i].name;
		priceUnitProduct.textContent = userBasket[i].price / 100 + " €";
		console.log(userBasket[i].name);

	};


		//Dernière ligne du tableau : Total
		facture.appendChild(rowTotal);
		rowTotal.appendChild(columnRefTotal);
		columnRefTotal.textContent = "Total à payer"
		rowTotal.appendChild(colPriceTotal);
		colPriceTotal.setAttribute("id", "sommeTotal")

		//Calcule de la somme totale à régler
		let totalPaye = 0;
		JSON.parse(localStorage.getItem("basketUser")).forEach((product)=>{
			totalPaye += product.price / 100;
		});

		//Affichage du prix total à régler
		console.log("total à payer : " + totalPaye);
		document.getElementById("sommeTotal").textContent = totalPaye + " €";
}	
};

removeProduct = (i) => {
		//recupérer le array
		userBasket.splice(i, 1); 
		//On vide le localstorage
		localStorage.clear();
		//mettre à jour le localStorage avec le nouveau panier
		localStorage.setItem('basketUser', JSON.stringify(userBasket));
		console.log("Administration : localStorage mis à jour");
		//Mise à jour de la page pour affichage de la suppression au client
		window.location.reload();
};


/*Formulaire et vérification de l'etat du panier
*************************************************/

  //vérifie les inputs du formulaire
  checkInput = () =>{
    //Controle Regex
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
        	checkMessage = "Vérifier/renseigner votre nom. Les caractères spéciaux et les chiffres ne sont pas autorisés";
        }else{
        	console.log("Administration : Nom ok");
        }
        //Test du prénom => aucun chiffre ou charactère spécial permis
        if(checkNumber.test(formPrenom) == true || checkSpecialCharacter.test(formPrenom) == true || formPrenom == ""){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre prénom. Les caractères spéciaux et les chiffres ne sont pas autorisés";
        }else{
        	console.log("Administration : Prénom ok");
        }
        //Test du mail selon le regex de la source L292
        if(checkMail.test(formMail) == false){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre email. Les caractères spéciaux ne sont pas autorisés";
        }else{
        	console.log("Administration : Adresse mail ok");
        }
        //Test de l'adresse => l'adresse ne contient pas obligatoirement un numéro de rue mais n'a pas de characteres spéciaux
        if(checkSpecialCharacter.test(formAdresse) == true || formAdresse == ""){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre adresse. Les caractères spéciaux ne sont pas autorisés";
        }else{
        	console.log("Administration : Adresse ok");
        }
        //Test de la ville => aucune ville en France ne comporte de chiffre ou charactères spéciaux
        if(checkNumber.test(formVille) == true || checkSpecialCharacter.test(formVille) == true || formVille == ""){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre ville. Les caractères spéciaux ou les chiffres ne sont pas autorisés";
        }else{
        	console.log("Administration : Ville ok");
        }
        //Si un des champs n'est pas bon => message d'alert avec la raison
        if(checkMessage != ""){
        	alert("Il est nécessaire de :" + "\n" + checkMessage);
        }
        //Si le formulaire est validé => construction de l'objet contact
        else{
        	contact = {
				lastName : formNom,
        		firstName : formPrenom,
        		address : formAdresse,
        		city : formVille,
        		email : formMail
        	};
        	return contact;
        }
	};
	

//Vérification du panier
checkBasket = () => {
	//Vérifier qu'il y ai au moins un produit dans le panier
	let basketStatut = JSON.parse(localStorage.getItem("basketUser"));
	//Si le panier est vide ou null
	if  (basketStatut.length < 1 || basketStatut == null) {
		alert("Votre panier est vide. Veuillez ajouter un produit dans votre panier.");
		return false;
	} else {
		console.log("Le panier n'est pas vide");
		return true;
	}
};


/*Envoi du formulaire à l'API
**********************************************/

//Tableau et objet demandé par l'API pour la commande
let contact;
let products = [];
let url = "http://localhost:3000/api/furniture/order";


//Fonction requête post de l'API
const sendData = (formSend) => {
  	return new Promise((resolve)=>{
  		let request = new XMLHttpRequest();
  		request.onreadystatechange = function() {
  			if(this.readyState == XMLHttpRequest.DONE && this.status == 201){
         	    //Sauvegarde du retour de l'API dans la sessionStorage pour affichage dans confirm.html
				sessionStorage.setItem("order", this.responseText);
				window.location = "./confirm.html";
				resolve(JSON.parse(this.responseText));
      }else {
      }
  };
  request.open("POST", url);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(formSend);
});
};

//Au click sur le btn de validation du formulaire
validForm = () =>{
    //Ecoute de l'event click du formulaire
    let btnForm = document.getElementById("formBasket");
    btnForm.addEventListener("submit", (event) => {
	event.preventDefault()
	//Lancement des verifications du panier et du formulaire => si Ok envoi à l'API
	if(checkBasket() == true && checkInput() != null){
	console.log("Administration : L'envoi peut être fait");
	userBasket.forEach((product) => {
		//Le push sert à Ajouter de nouveaux éléments à un tableau, puis renvoie la nouvelle longueur du tableau.
        products.push(product._id);
      });
	  console.log("Ce tableau sera envoyé à l'API : " + products);
	  
	  //Création de l'objet à envoyer
	  let objet = {
		contact,
		products,
		};
		console.log("Administration : " + objet);
		//Conversion de l'objet "objet" en string, puis envoie.
		let formSend = JSON.stringify(objet);
		sendData(formSend);
		console.log(objet);

	  
      //Une fois la commande effectuée retour à l'état initial de l'objet, du tableau et du localStorage
      contact = {};
      products = [];
      localStorage.clear();
    } else {
      console.log("ERROR");
    }
  });
};

/*Affichage des informations sur la page de confirmation
********************************************************/
resultOrder = () =>{
	if(sessionStorage.getItem("order") != null){
    //Parse du session storage
    let order = JSON.parse(sessionStorage.getItem("order"));
    //Ajout du prénom et de l'id de commande dans le html sur la page de confirmation
    document.getElementById("lastName").innerHTML = order.contact.lastName
    document.getElementById("orderId").innerHTML = order.orderId
    console.log(order);
}else{
  //avertissement et redirection vers l'accueil
  alert("Aucune commande passée, vous êtes arrivé ici par erreur");
  window.location = "./index.html";
}
};


recapCommande = () => {
	//Création de la structure principale du tableau  
	  let facture = document.createElement("table");
	  facture.setAttribute('id', 'tableConfirm');
      let firstRowTable = document.createElement("tr");
      let columnName = document.createElement("th");
	  let columnPriceUnit = document.createElement("th");
	 // let columnRemove = document.createElement("td");
      let rowTotal = document.createElement("tr");
      let columnRefTotal = document.createElement("th");
      let colPriceTotal = document.createElement("td");

      //Placement de la structure du tableau dans la page panier
      let factureSection = document.getElementById("confirmation-recap");
      factureSection.appendChild(facture);
      facture.appendChild(firstRowTable);
      firstRowTable.appendChild(columnName);
      columnName.textContent = "Nom du produit";
      firstRowTable.appendChild(columnPriceUnit);
	  columnPriceUnit.textContent = "Prix du produit";

	  //Incrémentation de l'id des lignes pour chaque produit
	  let i = 0;
	  let order = JSON.parse(sessionStorage.getItem("order"));

	  order.products.forEach((orderArticle)=> {
		let ligneProduct = document.createElement("tr");
        let nameProduct = document.createElement("td");
        let priceUnitProduct = document.createElement("td");

		//Attribution des class ou Id
		ligneProduct.setAttribute("id", "article_acheté"+i);

		//Insertion dans le HTML
		facture.appendChild(ligneProduct);
		facture.appendChild(nameProduct);
		facture.appendChild(priceUnitProduct);

		//Contenu des lignes
		nameProduct.textContent = orderArticle.name;
		priceUnitProduct.textContent = orderArticle.price / 100 + " €";
	  });

	  //Dernière ligne du tableau : Total
		facture.appendChild(rowTotal);
		rowTotal.appendChild(columnRefTotal);
		columnRefTotal.textContent = "Total payé"
		rowTotal.appendChild(colPriceTotal);
		colPriceTotal.setAttribute("id", "sommeConfirmTotal")

		//Calcule de la somme totale réglée
		let totalConfirmPaye = 0;
		order.products.forEach((product)=>{
			totalConfirmPaye += product.price / 100;
		});

		//Affichage du prix total réglé
		console.log("Prix total de la commande : " + totalConfirmPaye + " €");
		document.getElementById("sommeConfirmTotal").textContent = totalConfirmPaye + " €";
};
