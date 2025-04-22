document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const paginationContainer = document.getElementById('pagination');
    let allProducts = [];
    let filteredProducts = [];
    const itemsPerPage = 9;

    // 🟡 Crear el modal dinámicamente al cargar la página
    const modalHTML = `
        <div id="productModal" class="fixed inset-0 z-50 hidden bg-black/50 flex items-center justify-center">
            <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
                <button id="closeModal" class="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                <img id="modalImg" class="w-full h-48 object-cover rounded" src="" alt="Producto" />
                <h2 id="modalTitle" class="text-2xl font-semibold mt-4"></h2>
                <p id="modalDescripcion" class="text-gray-600 text-sm mt-2"></p>
                <button id="modalAddToCart" class="bg-yellow-500 hover:bg-yellow-600 text-white mt-4 px-4 py-2 rounded w-full">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    let modalProduct = null; // Para guardar el producto actual en el modal

    const renderProducts = (products, page = 1) => {
        productGrid.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedProducts = products.slice(start, end);

        paginatedProducts.forEach(product => {
            const productCard = `
                <article class="group bg-gradient-to-bl from-blue-50/70 to-white border border-stone-200 p-8 rounded-xl shadow-sm text-center hover:shadow-lg">
                    <p class="text-lg tracking-wide text-gray-700 font-semibold">${product.title}</p>
                    <p class="mt-1 text-xs tracking-wider text-gray-400 font-medium">${product.categoria}</p>
                    <div 
                        class="py-6 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer open-modal"
                        data-slug="${product.slug}"
                        data-title="${product.title}"
                        data-img="${product.img}"
                        data-price="${product.price}"
                        data-descripcion="${product.descripcion}"
                    >
                        <img class="h-32 w-96 object-cover" src="${product.img}" alt="${product.title}" />
                    </div>
                    <p class="text-gray-700 text-xl tracking-wide">S/ ${product.price.toFixed(2)}</p>
                    <div class="py-8">
                        <div class="top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent from-10% via-gray-300 to-transparent to-90%"></div>
                    </div>
                    <button 
                        class="px-7 py-2 border border-yellow-600 text-yellow-600 rounded-full transition-all duration-300 ease-in-out
                        hover:bg-transparent hover:border-yellow-700/80 hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-700/80 hover:bg-clip-text hover:text-transparent hover:scale-103 cursor-pointer add-to-cart"
                        data-slug="${product.slug}"
                        data-title="${product.title}"
                        data-img="${product.img}"
                        data-price="${product.price}"
                        data-descripcion="${product.descripcion}"
                    >
                        AGREGAR
                    </button>
                </article>
            `;
            productGrid.innerHTML += productCard;
        });

        renderPagination(products.length, page);
    };

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

    productGrid.addEventListener('filterProducts', (event) => {
        const { categories } = event.detail;
        filteredProducts = categories.length
            ? allProducts.filter(product => categories.includes(product.categoria))
            : allProducts;

        renderProducts(filteredProducts, 1);
    });

    // Abrir modal de producto
    productGrid.addEventListener('click', (event) => {
        const addButton = event.target.closest('.add-to-cart');
        const modalTarget = event.target.closest('.open-modal');

        if (addButton) {
            const producto = {
                slug: addButton.dataset.slug,
                title: addButton.dataset.title,
                img: addButton.dataset.img,
                price: parseFloat(addButton.dataset.price),
                descripcion: addButton.dataset.descripcion || 'Sin descripción.'
            };
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(producto);
            localStorage.setItem('cart', JSON.stringify(cart));

            if (typeof updateCartUI === 'function') updateCartUI();
        }

        if (modalTarget) {
            const producto = {
                slug: modalTarget.dataset.slug,
                title: modalTarget.dataset.title,
                img: modalTarget.dataset.img,
                price: parseFloat(modalTarget.dataset.price),
                descripcion: modalTarget.dataset.descripcion || 'Sin descripción.'
            };
            modalProduct = producto;

            document.getElementById('modalImg').src = producto.img;
            document.getElementById('modalTitle').textContent = producto.title;
            document.getElementById('modalDescripcion').textContent = producto.descripcion;
            document.getElementById('productModal').classList.remove('hidden');
        }
    });


    // Cerrar modal
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('productModal').classList.add('hidden');
        modalProduct = null;
    });

    // Agregar producto al carrito desde el modal
    document.getElementById('modalAddToCart').addEventListener('click', () => {
        if (!modalProduct) return;

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(modalProduct);
        localStorage.setItem('cart', JSON.stringify(cart));

        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }

        // Cerrar modal tras agregar
        document.getElementById('productModal').classList.add('hidden');
        modalProduct = null;
    });

    // Inicializar productos
    fetch('/api/products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            filteredProducts = data;
            renderProducts(filteredProducts, 1);
        });
});
