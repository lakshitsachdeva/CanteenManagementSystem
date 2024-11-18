document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('order-form');
    const itemCategory = document.getElementById('item-category');
    const menuItems = document.getElementById('menu-items');
    const itemQuantity = document.getElementById('item-quantity');
    const logoutButton = document.getElementById('logout');
    const notification = document.getElementById('notification');
    const addMoneyForm = document.getElementById('add-money-form');
    const addAmount = document.getElementById('add-amount');
    const balanceDisplay = document.getElementById('balance');

    let accountBalance = parseFloat(localStorage.getItem('accountBalance')) || 0;
    updateBalanceDisplay();

    const foodItems = [
        { name: 'Burger', price: 120, image: 'burger.png?height=100&width=100&text=Burger' },
        { name: 'Pizza', price: 200, image: 'pasta.png?height=100&width=100&text=Pizza' },
        { name: 'Sandwich', price: 80, image: 'sandwich.jpg?height=100&width=100&text=Sandwich' },
    ];

    const beverageItems = [
        { name: 'Coffee', price: 40, image: 'coffee.jpg?height=100&width=100&text=Coffee' },
        { name: 'Tea', price: 20, image: 'tea.jpeg?height=100&width=100&text=Tea' },
        { name: 'Juice', price: 50, image: 'juice.jpg?height=100&width=100&text=Juice' },
    ];

    function updateBalanceDisplay() {
        balanceDisplay.textContent = accountBalance.toFixed(2);
        localStorage.setItem('accountBalance', accountBalance.toString());
    }

    function generateOrderId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    addMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(addAmount.value);
        if (amount > 0) {
            accountBalance += amount;
            updateBalanceDisplay();
            showNotification(`Added ₹${amount.toFixed(2)} to your account.`);
            addAmount.value = '';
        }
    });

    itemCategory.addEventListener('change', () => {
        const category = itemCategory.value;
        menuItems.innerHTML = '';

        const items = category === 'food' ? foodItems : beverageItems;

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="menu-item-image">
                <p>${item.name}</p>
                <p>₹${item.price.toFixed(2)}</p>
                <input type="radio" name="item" value="${item.name}" data-price="${item.price}" id="${item.name}">
                <label for="${item.name}">Select</label>
            `;
            menuItems.appendChild(itemElement);
        });
    });

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedItem = document.querySelector('input[name="item"]:checked');
        if (!selectedItem) {
            showNotification('Please select an item.', 'error');
            return;
        }

        const itemName = selectedItem.value;
        const itemPrice = parseFloat(selectedItem.dataset.price);
        const quantity = parseInt(itemQuantity.value);
        const totalCost = itemPrice * quantity;

        if (accountBalance < totalCost) {
            showNotification('Insufficient balance. Please add money to your account.', 'error');
            return;
        }

        accountBalance -= totalCost;
        updateBalanceDisplay();

        const userType = localStorage.getItem('userType') || 'student';
        const isStaff = userType === 'staff';

        // Create order object for admin queue
        const order = {
            id: generateOrderId(),
            customerName: localStorage.getItem('username') || 'Guest',
            customerType: isStaff ? 'Staff' : 'Student',
            itemName: itemName,
            itemQuantity: quantity,
            totalCost: totalCost,
            priority: isStaff ? 'high' : 'normal',
            timestamp: new Date().toISOString()
        };

        // Get existing admin queue
        const adminQueue = JSON.parse(localStorage.getItem('orderQueue')) || [];
        
        // Add new order to admin queue
        adminQueue.push(order);
        
        // Save updated queue
        localStorage.setItem('orderQueue', JSON.stringify(adminQueue));

        // Also save to customer's order history
        const customerOrders = JSON.parse(localStorage.getItem('customerOrders')) || [];
        customerOrders.push(order);
        localStorage.setItem('customerOrders', JSON.stringify(customerOrders));

        showNotification(`Order placed: ${quantity} ${itemName}(s) for ₹${totalCost.toFixed(2)}`);
        orderForm.reset();
        menuItems.innerHTML = '';
    });

    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        setTimeout(() => {
            notification.className = 'notification';
        }, 3000);
    }

    logoutButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});