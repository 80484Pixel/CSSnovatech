// This function displays all products in the admin panel.
function afficherProduitsAdmin() {
  // Get the container from admin.html.
  const liste = document.getElementById("admin-product-list");

  // Get products saved in localStorage.
  // If none exist, use the original PRODUCTS array.
  const produitsSauvegardes = localStorage.getItem("auratek_products");

  const produits =
    produitsSauvegardes !== null ? JSON.parse(produitsSauvegardes) : PRODUCTS;

  document.getElementById("total-products").textContent = produits.length;

  // Clear the previous list.
  liste.innerHTML = "";

  // Display each product.
  produits.forEach((produit) => {
    const element = document.createElement("div");
    element.className = "admin-product";

    const infos = document.createElement("div");
    infos.className = "admin-product-info";

    const nom = document.createElement("h3");
    nom.textContent = produit.name;

    const prix = document.createElement("p");
    prix.textContent = `$${Number(produit.price).toFixed(2)}`;

    infos.appendChild(nom);
    infos.appendChild(prix);
    element.appendChild(infos);
    // Create the Delete button
    const boutonSupprimer = document.createElement("button");

    boutonSupprimer.textContent = "Delete";
    boutonSupprimer.className = "remove-button";

    // Delete the product when clicked
    boutonSupprimer.addEventListener("click", function () {
      supprimerProduit(produit.id);
    });

    element.appendChild(boutonSupprimer);

    liste.appendChild(element);
  });
}

// Run the function when the page loads.
afficherProduitsAdmin();

// Get the form from admin.html
const formulaire = document.getElementById("product-form");

// Listen for the Save Product button
formulaire.addEventListener("submit", function (event) {
  // Prevent the page from refreshing
  event.preventDefault();

  // Get the information entered in the form
  const nom = document.getElementById("product-name").value;
  const prix = Number(document.getElementById("product-price").value);
  const categorie = document.getElementById("product-category").value;
  const image = document.getElementById("product-image").value;
  const description = document.getElementById("product-description").value;

  // Get the existing products
  const produitsSauvegardes = localStorage.getItem("auratek_products");

  const produits =
    produitsSauvegardes !== null
      ? JSON.parse(produitsSauvegardes)
      : [...PRODUCTS];

  // Create a unique ID for the new product
  const nouvelId = Math.max(0, ...produits.map((p) => Number(p.id))) + 1;

  // Create the new product
  const nouveauProduit = {
    id: nouvelId,
    name: nom,
    price: prix,
    category: categorie,
    image: image,
    description: description,
    features: [],
  };

  // Add it to the product list
  produits.push(nouveauProduit);

  // Save the updated list in localStorage
  localStorage.setItem("auratek_products", JSON.stringify(produits));

  // Update the products displayed in the admin panel
  afficherProduitsAdmin();

  // Empty the form
  formulaire.reset();

  // Confirmation message
  alert("Product added successfully!");
});

function supprimerProduit(id) {
  // Ask for confirmation
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  // Get the current product list
  const sauvegarde = localStorage.getItem("auratek_products");

  const produits = sauvegarde !== null ? JSON.parse(sauvegarde) : [...PRODUCTS];

  // Keep all products except the selected one
  const nouveauxProduits = produits.filter(
    (produit) => String(produit.id) !== String(id),
  );

  // Save the updated list
  localStorage.setItem("auratek_products", JSON.stringify(nouveauxProduits));

  // Refresh the admin list
  afficherProduitsAdmin();

  alert("Product deleted successfully!");
}
