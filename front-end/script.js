function getNameAndPriceProd() {
  //event.preventDefault();
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
            var produit1 = document.getElementById('product1_title');
            produit1.textContent = response.name;
      }
    };
    request.open("GET", "http://localhost:3000/api/furniture/");
    request.send();
    }

getNameAndPriceProd();

/*const produitSell = "furniture"  //Au choix entre : "cameras" - "furniture" - "teddies"
const APIURL = "http://localhost:3000/api/" + produitSell + "/";

//id du produit pour permettre un tri dans l'API

let idProduit = "";

getProduits = () =>{
	return new Promise((resolve) =>{
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == XMLHttpRequest.DONE && this.status == 200) 
			{
				resolve(JSON.parse(this.responseText));
				console.log("Administration : connection ok");

				//L'appel est réussi => suppression des message d'erreur
				error = document.getElementById("error");
				//On supprime le message d'erreur s'il existe
				if(error){
					error.remove();
				}
			}else{
				console.log("Administration : ERROR connection API");
			}
		}
		request.open("GET", APIURL + idProduit);
		request.send();
	});
};

async function allProductsList(){
		const produits = await getProduits();

		//Pour chaque produit de l'API on créé l'encadré HTML du produit
		produits.forEach((produit) =>
		{ 
            

            let produitName = document.createElement("h2");
            let produitPrice = document.createElement("p");
            let produitLink = document.createElement("a");

            produitLink.setAttribute("href", "product.html?id=" + produit._id);

            let main = document.getElementById('product1');
            main.appendChild(produitName);
            main.appendChild(produitPrice);
            main.appendChild(produitLink);

            produitName.textContent = produit.name;
            produitPrice.textContent = produit.price / 100 + " euros";
            produitLink.textContent = "Voir le produit";

            //Déterminer le contenu des balises
            //produitName.innerHTML=produit.name;
            //produitPrice.innerHTML=produit.price;
      });
    };
    
    allProductsList();*/