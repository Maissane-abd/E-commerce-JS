class Product {
    constructor(id, name, price, stock) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.stock = stock;
    }
  }
  
  class Shop {
    constructor() {
      this.products = [];
      this.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    }
  
    async loadProducts() {
      const response = await fetch('./data/products.json');
      const data = await response.json();
      this.products = data.map(p => new Product(p.id, p.name, p.price, p.stock));
      this.renderProducts();
    }
  
    renderProducts() {
      const container = document.getElementById('products-container');
      container.innerHTML = "";
  
      this.products.forEach(product => {
        const div = document.createElement('div');
        div.className = "product-card";
        div.innerHTML = `
          <h3>${product.name}</h3>
          <p>Prix : ${product.price} €</p>
          <p>Stock : ${product.stock}</p>
          <label>Quantité :
            <input type="number" min="1" max="${product.stock}" value="1" id="qty-${product.id}">
          </label>
          <br><br>
          <button onclick="shop.addToCart(${product.id})">Ajouter au panier</button>
          <button onclick="shop.toggleFavorite(${product.id})">
            ${this.favorites.includes(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
        `;
        container.appendChild(div);
      });
    }
  
    addToCart(productId) {
      const qtyInput = document.getElementById(`qty-${productId}`);
      const quantity = parseInt(qtyInput.value);
  
      if (isNaN(quantity) || quantity <= 0) {
        alert("Quantité invalide.");
        return;
      }
  
      const product = this.products.find(p => p.id === productId);
      if (quantity > product.stock) {
        alert("Quantité demandée supérieure au stock.");
        return;
      }
  
      const existing = this.cart.find(item => item.id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.cart.push({ id: productId, quantity });
      }
  
      localStorage.setItem("cart", JSON.stringify(this.cart));
      alert("Produit ajouté au panier !");
    }
  
    toggleFavorite(productId) {
      const index = this.favorites.indexOf(productId);
      if (index !== -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(productId);
      }
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
      this.renderProducts();
    }
  }
  
  const shop = new Shop();
  shop.loadProducts();