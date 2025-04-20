document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const paginationContainer = document.getElementById('pagination');
    let allProducts = [];
    let filteredProducts = [];
    const itemsPerPage = 9;

    // Función para renderizar productos
    const renderProducts = (products, page = 1) => {
        productGrid.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedProducts = products.slice(start, end);

        paginatedProducts.forEach(product => {
            const productCard = `
                <article class="group bg-gradient-to-bl from-blue-50/70 to-white border border-stone-200 p-8 rounded-xl shadow-sm text-center hover:shadow-lg">

                 <!-- Título -->
                    <p class="text-lg tracking-wide text-gray-700 font-semibold">${product.title}</p>

                <!-- Descripción -->
                    <p class="mt-1 text-xs tracking-wider text-gray-400 font-medium">${product.categoria}</p>

                 <!-- Imagen -->
                    <div class="py-6 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-105">
                        <img class="h-32 w-96 object-cover" src="${product.img}" alt="${product.title}" />
                    </div>
                    
                <!-- Precio -->
                    <p class="text-gray-700 text-xl tracking-wide">S/ ${product.price.toFixed(2)}</p>

                <!-- Línea con degradado --> 
                    <div class="py-8">
                        <div class="top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent from-10% via-gray-300 to-transparent to-90%"></div>
                    </div>

                <!-- Botón de compra -->
                    <button 
                        class="px-7 py-2 border border-yellow-600 text-yellow-600 rounded-full transition-all duration-300 ease-in-out
    hover:bg-transparent hover:border-yellow-700/80 hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-700/80 hover:bg-clip-text hover:text-transparent hover:scale-103 cursor-pointer add-to-cart"
                        data-slug="${product.slug}"
                        data-title="${product.title}"
                        data-img="${product.img}"
                        data-price="${product.price}"
                    >
                        COMPRAR
                    </button>
                </article>
            `;
            productGrid.innerHTML += productCard;
        });

        renderPagination(products.length, page);
    };

    // Función para renderizar paginación
    const renderPagination = (totalItems, currentPage) => {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = `px-4 py-2 border cursor-pointer ${i === currentPage ?  'bg-linear-to-bl from-yellow-600/70 to-yellow-500 text-white' : 'bg-white text-yellow-500'} rounded `;
            button.addEventListener('click', () => renderProducts(filteredProducts, i));
            paginationContainer.appendChild(button);
        }
    };

    // Escuchar el evento de filtrado
    productGrid.addEventListener('filterProducts', (event) => {
        const { categories } = event.detail;
        filteredProducts = categories.length
            ? allProducts.filter(product => categories.includes(product.categoria))
            : allProducts;

        renderProducts(filteredProducts, 1);
    });

    // Delegar evento para los botones "COMPRAR"
    productGrid.addEventListener('click', (event) => {
        const button = event.target.closest('.add-to-cart'); // Asegurarse de que el clic sea en un botón válido
        if (button) {
            const product = {
                slug: button.dataset.slug,
                title: button.dataset.title,
                img: button.dataset.img,
                price: parseFloat(button.dataset.price)
            };

            // Validar que los datos no sean placeholders
            if (!product.slug || !product.title || !product.img || isNaN(product.price)) {
                console.error("❌ Error: Los datos del producto no se están interpolando correctamente.");
                return;
            }

            console.log("Producto para agregar al carrito:", product); // Depuración

            // Guardar el producto en el carrito (localStorage)
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));

            // Llamar a la función centralizada para actualizar la interfaz del carrito
            if (typeof updateCartUI === 'function') {
                updateCartUI(); // Asegúrate de que esta función esté disponible globalmente
            } else {
                console.error("❌ Error: La función updateCartUI no está disponible.");
            }
        }
    });

    // Inicializar productos (simulación de datos)
    fetch('/api/products.json') // Cambia esto por la ruta real de tu API o datos
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            filteredProducts = data;
            renderProducts(filteredProducts, 1);
        });
});