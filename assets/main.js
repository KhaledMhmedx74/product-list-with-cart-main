let deserts = document.querySelector('.desserts .content');
const numberOfProducts = document.getElementById('numOfPros');

let cartProduct = [];
numberOfProducts.innerHTML = `Your Cart (${cartProduct.length})`;

fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
        data.forEach((ele) => {
            let amount = 1;
            // Generate product card with data-name attribute
            let pro = `<div class="card" data-name="${ele.name}">
                        <div class="image">
                            <img src="${ele.image.desktop}" alt="" />
                            <div class="add">
                                <img src="./assets/images/icon-add-to-cart.svg" alt="" />
                                Add to Cart
                            </div>
                            <div class='amount' style="display: none;">
                                <span class="decrease">-</span>
                                <p class="amount-value">${amount}</p>
                                <span class="increase">+</span>
                            </div>
                        </div>
                        <div class="details">
                            <p>${ele.category}</p>
                            <h3>${ele.name}</h3>
                            <div class="price">$${ele.price}</div>
                        </div>
                    </div>`;
            deserts.innerHTML += pro;
        });

        // Querying the elements after they have been rendered
        const addButtons = document.querySelectorAll('.add');
        const amountContainers = document.querySelectorAll('.amount');
        
        addButtons.forEach((button) => {
            let amount = 1;
            const currentProductName = button.closest('.card').getAttribute('data-name');
            const currentProduct = data.find(ele => ele.name === currentProductName);

            // "Add to Cart" button click event
            button.addEventListener('click', () => {
                handleAddToCart(currentProduct, amount);
                button.style.display = 'none';  // Hide "Add to Cart" button
                button.parentElement.querySelector('.amount').style.display = 'flex';  // Show amount section
            });

            // Handle amount increase and decrease
            const decreaseButton = button.parentElement.querySelector('.decrease');
            const increaseButton = button.parentElement.querySelector('.increase');
            const amountValue = button.parentElement.querySelector('.amount-value');

            // Decrease amount
            decreaseButton.addEventListener('click', () => {
                if (amount > 1) {
                    amount--;
                    amountValue.innerText = amount;
                    updateCartAmount(currentProduct, amount);
                }
            });

            // Increase amount
            increaseButton.addEventListener('click', () => {
                amount++;
                amountValue.innerText = amount;
                updateCartAmount(currentProduct, amount);
            });
        });
    });

function handleAddToCart(ele, amount) {
    cartProduct.push({ ele, amount });
    numberOfProducts.innerHTML = `Your Cart (${cartProduct.length})`;
    checkCart(cartProduct);
}

function updateCartAmount(ele, newAmount) {
    // Find the product in the cart and update its amount
    const productInCart = cartProduct.find((item) => item.ele.name === ele.name);
    if (productInCart) {
        productInCart.amount = newAmount;
    }
    checkCart(cartProduct);
}

function removeFromCart(ele) {
    // Remove the product from cartProduct array
    cartProduct = cartProduct.filter((item) => item.ele.name !== ele.name);
    numberOfProducts.innerHTML = `Your Cart (${cartProduct.length})`;
    checkCart(cartProduct);

    // Re-display the "Add to Cart" button and hide amount section
    const card = document.querySelector(`.card[data-name="${ele.name}"]`);
    card.querySelector('.add').style.display = 'flex'; // Show "Add to Cart" button again
    card.querySelector('.amount').style.display = 'none'; // Hide amount section
}

const cart = document.querySelector('.cart .details');

function checkCart(arr) {
    if (arr.length > 0) {
        cart.innerHTML = ''; // Clear previous cart content
        let totalPrices = 0;
        arr.forEach((element) => {
            totalPrices += element.amount * element.ele.price;
            cart.innerHTML += `
                <div class="cart-item">
                    <div class='cart-details'>
                        <h4>${element.ele.name}</h4>
                        <div class='tot'>
                                <span class='num'>${element.amount}x</span><span class='pri'>@ $${element.ele.price}</span><span class='numxpri'>$${element.amount * element.ele.price}</span>
                        </div>
                    </div>
                    <button class="remove" data-name="${element.ele.name}"><img src="./assets/images/icon-remove-item.svg" alt="" /></button>
                </div>
            </div>`;
        });
        cart.innerHTML += `
        <div class='total-prices'>
            Order Total<h1>$${totalPrices}</h1>
        </div>
        <p class='carbon'><img src="./assets/images/icon-carbon-neutral.svg" alt=""> This is a <strong>carbon-neutral</strong> delivery</p>
        <button id='confirm' onclick= showConfirmContainer()>Confirm Order<button>`
        // Add event listeners to the "remove" buttons
        const removeButtons = document.querySelectorAll('.remove');
        removeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const productName = button.getAttribute('data-name');
                const productToRemove = arr.find((item) => item.ele.name === productName);
                removeFromCart(productToRemove.ele);
            });
        });
    } else {
        cart.innerHTML = `<img src="./assets/images/illustration-empty-cart.svg" alt="" />
                                <p>Your added items will appear here</p>`;
    }
}

checkCart(cartProduct);

let confirmContainer = document.querySelector('.order-confirmed');
let confirmContainerContent = document.querySelector('.order-confirmed .content .products');


function showConfirmContainer(){
    confirmContainer.style.display = 'flex';
    let t = 0;
    cartProduct.forEach((element) => {
        confirmContainerContent.innerHTML += `
        <div class="card">
        <div class='details'>
        <img src="${element.ele.image.thumbnail}" alt="" />
        <div class="small-details">
          <h4>${element.ele.name}</h4>
          <p><span class="amount">${element.amount}x</span><span class="price">@ $${element.ele.price}</span></p>
        </div>
        </div>
        <div class="total-price">$${element.amount * element.ele.price}</div>
        </div>`;
        t += element.amount * element.ele.price;
    });
    confirmContainerContent.innerHTML += `
    <div class='total-prices'>
    Order Total<h2>$${t}</h2>
    </div>
    `
    const centerY = document.documentElement.scrollHeight / 2 - window.innerHeight / 2;
    window.scrollTo({
        top: centerY,
        behavior: 'smooth'
    });
}


function handleNewOrder() {
    cartProduct = [];
    checkCart(cartProduct);
    confirmContainer.style.display = 'none';
    document.querySelectorAll('.add').forEach((ele)=> ele.style.display = 'flex') // Show All "Add to Cart" button again
    document.querySelectorAll('.amount').forEach((ele) => ele.style.display = 'none') // Hide All amount section
    numberOfProducts.innerHTML = `Your Cart (0)`;
    confirmContainerContent.innerHTML = ''
}