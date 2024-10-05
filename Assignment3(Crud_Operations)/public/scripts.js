let products = [];
let cart = [];
let isCartVisible = false;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    addProducts();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('add-data-button').addEventListener('click', showAddDataForm);
    document.getElementById('cart-toggle').addEventListener('click', toggleCart);
}

function showAddDataForm() {
    const formHtml = `
        <div id="add-data-form" class="popup">
            <h2>Add New Product</h2>
            <form id="new-product-form">
                <input type="text" id="new-title" placeholder="Title" required>
                <input type="number" id="new-price" placeholder="Price" required>
                <input type="text" id="new-date" placeholder="Date" required>
                <input type="text" id="new-location" placeholder="Location" required>
                <input type="text" id="new-company" placeholder="Company" required>
                <input type="url" id="new-image-url" placeholder="Image URL" required>
                <button type="submit">Add Product</button>
                <button type="button" onclick="closePopup()">Cancel</button>
            </form>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
    document.getElementById('new-product-form').onsubmit = submitNewProduct;
}

function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) popup.remove();
}

function submitNewProduct(event) {
    event.preventDefault();
    const newProduct = {
        title: document.getElementById('new-title').value,
        price: parseFloat(document.getElementById('new-price').value),
        date: document.getElementById('new-date').value,
        location: document.getElementById('new-location').value,
        company: document.getElementById('new-company').value,
        imageUrl: document.getElementById('new-image-url').value
    };

    fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        products.push(data);
        displayProducts();
        closePopup();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function toggleCart() {
    const cartContainer = document.getElementById('cart-container');
    isCartVisible = !isCartVisible;
    cartContainer.classList.toggle('visible', isCartVisible);
    updateCartUI();
}

function updateCartToggleButton() {
    const toggleButton = document.getElementById('cart-toggle');
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    toggleButton.textContent = `Cart (${itemCount})`;
}

function addProducts() {
    console.log('Fetching products...');
    fetch('http://localhost:3000/data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            products = data;
            displayProducts();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('product-list').innerHTML = `
                <p>Error loading products: ${error.message}</p>
                <p>Please check the console for more details.</p>
            `;
        });
}

function displayProducts() {
    console.log('Displaying products...');
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p>No products available</p>';
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        const img = document.createElement('img');
        img.src = product.imageUrl;
        img.alt = product.title;

        const title = document.createElement('h2');
        title.textContent = product.title;

        const price = document.createElement('p');
        price.textContent = `$${product.price}`;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'product-buttons';

        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.onclick = () => showProductDetails(product);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => showEditForm(product);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.onclick = () => addProductToCart(product);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteProduct(product.id);

        buttonsDiv.appendChild(viewButton);
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(addToCartButton);
        buttonsDiv.appendChild(deleteButton);

        productDiv.appendChild(img);
        productDiv.appendChild(title);
        productDiv.appendChild(buttonsDiv);

        container.appendChild(productDiv);
    });
}

function deleteProduct(productId) {
    fetch(`http://localhost:3000/data/${productId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Product deleted successfully');
            products = products.filter(p => p.id !== productId);
            displayProducts();
        } else {
            throw new Error('Failed to delete product');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function showProductDetails(product) {
    const popupHtml = `
        <div class="popup">
            <h2>${product.title}</h2>
            <p>Price: $${product.price}</p>
            <p>Date: ${product.date}</p>
            <p>Location: ${product.location}</p>
            <p>Company: ${product.company}</p>
            <button onclick="closePopup()">Close</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function showEditForm(product) {
    const formHtml = `
        <div id="edit-product-form" class="popup">
            <h2>Edit Product</h2>
            <form id="edit-form">
                <input type="text" id="edit-title" value="${product.title}" required>
                <input type="number" id="edit-price" value="${product.price}" required>
                <input type="text" id="edit-date" value="${product.date}" required>
                <input type="text" id="edit-location" value="${product.location}" required>
                <input type="text" id="edit-company" value="${product.company}" required>
                <input type="url" id="edit-image-url" value="${product.imageUrl}" required>
                <button type="submit">Save Changes</button>
                <button type="button" onclick="closePopup()">Cancel</button>
            </form>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
    document.getElementById('edit-form').onsubmit = (e) => submitEditForm(e, product.id);
}

function showEditForm(product) {
    const formHtml = `
        <div id="edit-product-form" class="popup">
            <h2>Edit Product</h2>
            <form id="edit-form">
                <input type="text" id="edit-title" value="${product.title}" required>
                <input type="number" id="edit-price" value="${product.price}" required>
                <input type="text" id="edit-date" value="${product.date}" required>
                <input type="text" id="edit-location" value="${product.location}" required>
                <input type="text" id="edit-company" value="${product.company}" required>
                <input type="url" id="edit-image-url" value="${product.imageUrl}" required>
                <button type="submit">Save Changes</button>
                <button type="button" onclick="closePopup()">Cancel</button>
            </form>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
    document.getElementById('edit-form').onsubmit = (e) => submitEditForm(e, product.id);
}

function addProductToCart(product) {
    console.log('Adding to cart:', product);
    const productInCart = cart.find(item => item.id === product.id);

    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    updateCartToggleButton();
}

function updateCartUI() {
    console.log('Updating cart UI');
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '<h2>Your Cart</h2>';

    if (cart.length === 0) {
        cartContainer.innerHTML += '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            const itemInfo = document.createElement('div');
            itemInfo.className = 'cart-item-info';

            const title = document.createElement('div');
            title.className = 'cart-item-title';
            title.textContent = item.title;

            const price = document.createElement('div');
            price.className = 'cart-item-price';
            price.textContent = `$${item.price * item.quantity}`;

            itemInfo.appendChild(title);
            itemInfo.appendChild(price);

            const controls = document.createElement('div');
            controls.className = 'cart-item-controls';

            const decrementButton = document.createElement('button');
            decrementButton.textContent = '-';
            decrementButton.onclick = () => updateCartItemQuantity(item.id, -1);

            const quantity = document.createElement('input');
            quantity.type = 'number';
            quantity.value = item.quantity;
            quantity.min = 1;
            quantity.onchange = (e) => updateCartItemQuantity(item.id, parseInt(e.target.value) - item.quantity);

            const incrementButton = document.createElement('button');
            incrementButton.textContent = '+';
            incrementButton.onclick = () => updateCartItemQuantity(item.id, 1);

            controls.appendChild(decrementButton);
            controls.appendChild(quantity);
            controls.appendChild(incrementButton);

            cartItem.appendChild(itemInfo);
            cartItem.appendChild(controls);

            cartContainer.appendChild(cartItem);
        });

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalElement = document.createElement('div');
        totalElement.id = 'cart-total';
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
        cartContainer.appendChild(totalElement);
    }
}

function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        updateCartUI();
        updateCartToggleButton();
    }
}

document.addEventListener('click', (event) => {
    if (!event.target.closest('.popup') && !event.target.closest('button')) {
        closePopup();
    }
});