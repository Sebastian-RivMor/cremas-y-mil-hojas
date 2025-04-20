const continuePago = document.getElementById('continue-pago');

document.addEventListener("DOMContentLoaded", function () {
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    const checkoutModal = document.getElementById('checkout-modal');
    const continueShopping = document.getElementById('continue-shopping');
    const checkoutOverlay = document.getElementById("checkout-overlay");
    const cartContainer = document.getElementById('cart-items');

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        const cart = getCart();
        cartCount.textContent = cart.length;
        cartContainer.innerHTML = ""; // Limpiar el carrito antes de actualizar
        const cartTotal = document.getElementById("cart-total"); // Elemento del total
    
        let total = 0; // Variable para calcular el total
    
        if (cart.length === 0) {
            cartContainer.innerHTML = "<p class='text-gray-500 text-center'>Tu carrito está vacío.</p>";
            cartTotal.textContent = "Total: S/ 0.00"; // Reiniciar total
        } else {
            cart.forEach((product, index) => {
                const item = document.createElement('div');
                item.classList.add('flex', 'items-center', 'justify-between', 'border-b', 'py-2', 'gap-2');
    
                item.innerHTML = `
                    <img src="${product.img}" class="checkout-img border">
                    <div class="flex-1 text-left">
                        <p class="font-semibold text-sm">${product.title}</p>
                        <p class="text-gray-600 text-xs">S/ ${product.price}</p>
                    </div>
                    <button class="cursor-pointer remove-item text-red-600 text-xs px-2">✕</button>
                `;
    
                cartContainer.appendChild(item);
                total += parseFloat(product.price)||0; // Sumar precios al total
            });
    
            cartTotal.textContent = `Total: S/ ${total.toFixed(2)}`; // Mostrar total con 2 decimales
    
            // Agregar evento a los botones de eliminar
            document.querySelectorAll('.remove-item').forEach((button, index) => {
                button.addEventListener('click', () => {
                    removeItem(index);
                });
            });
        }
    }
    
    
    
    // Función para eliminar un ítem del carrito
    function removeItem(index) {
        let cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
    }
    
    
    // Función para eliminar un ítem del carrito
    function removeItem(index) {
        let cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
    }
    

    function addToCart(event) {
        const button = event.target;
        const product = {
            slug: button.dataset.slug,
            title: button.dataset.title,
            img: button.dataset.img,
            price: button.dataset.price
        };
    
        // 🚨 Validar que los datos no sean {slug}, {title}, etc.
        if (product.slug.includes("{") || product.title.includes("{")) {
            console.error("❌ Error: Los datos del producto no se están interpolando correctamente.");
            return;
        }
    
        let cart = getCart();
        cart.push(product);
        saveCart(cart);
    }
    
        

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    cartButton.addEventListener('click', () => {
        checkoutModal.classList.remove('hidden');
        checkoutOverlay.classList.remove('hidden'); // Muestra el overlay
    });
    
    continueShopping.addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
        checkoutOverlay.classList.add('hidden'); // Oculta el overlay
    });

    continuePago.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            alert("Tu carrito está vacío. Añade productos para comprar.");
            return;
        }

        window.location.href = "/pago";
    });
    
    checkoutOverlay.addEventListener("click", () => {
        checkoutModal.classList.add("hidden");
        checkoutOverlay.classList.add("hidden");
    });
    

    // Inicializar la UI del carrito
    updateCartUI();
});
