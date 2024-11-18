document.addEventListener('DOMContentLoaded', () => {
    const pendingOrdersList = document.getElementById('pending-orders');
    const readyOrdersList = document.getElementById('ready-orders');
    const logoutButton = document.getElementById('logout');
    const notification = document.getElementById('notification');

    function updateOrders() {
        const orderQueue = JSON.parse(localStorage.getItem('orderQueue')) || [];
        const readyOrders = JSON.parse(localStorage.getItem('readyOrders')) || [];

        // Sort order queue by priority (high first) and then by timestamp
        orderQueue.sort((a, b) => {
            if (a.priority === b.priority) {
                return new Date(a.timestamp) - new Date(b.timestamp);
            }
            return a.priority === 'high' ? -1 : 1;
        });

        pendingOrdersList.innerHTML = '';
        orderQueue.forEach(order => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${order.customerName} (${order.customerType})</span>
                <span>${order.itemName} x${order.itemQuantity}</span>
                <span>₹${order.totalCost.toFixed(2)}</span>
                <span>Priority: ${order.priority}</span>
                <button class="ready-button" data-id="${order.id}">Mark Ready</button>
            `;
            pendingOrdersList.appendChild(li);
        });

        readyOrdersList.innerHTML = '';
        readyOrders.forEach(order => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${order.customerName} (${order.customerType})</span>
                <span>${order.itemName} x${order.itemQuantity}</span>
                <span>₹${order.totalCost.toFixed(2)}</span>
                <button class="complete-button" data-id="${order.id}">Mark Complete</button>
            `;
            readyOrdersList.appendChild(li);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.ready-button').forEach(button => {
            button.addEventListener('click', markOrderReady);
        });

        document.querySelectorAll('.complete-button').forEach(button => {
            button.addEventListener('click', markOrderComplete);
        });
    }

    function markOrderReady(e) {
        const orderId = e.target.getAttribute('data-id');
        const orderQueue = JSON.parse(localStorage.getItem('orderQueue')) || [];
        const readyOrders = JSON.parse(localStorage.getItem('readyOrders')) || [];

        const orderIndex = orderQueue.findIndex(order => order.id.toString() === orderId);
        if (orderIndex !== -1) {
            const order = orderQueue.splice(orderIndex, 1)[0];
            readyOrders.push(order);

            localStorage.setItem('orderQueue', JSON.stringify(orderQueue));
            localStorage.setItem('readyOrders', JSON.stringify(readyOrders));

            updateOrders();
            showNotification(`Order for ${order.customerName} is ready!`);
        }
    }

    function markOrderComplete(e) {
        const orderId = e.target.getAttribute('data-id');
        const readyOrders = JSON.parse(localStorage.getItem('readyOrders')) || [];

        const orderIndex = readyOrders.findIndex(order => order.id.toString() === orderId);
        if (orderIndex !== -1) {
            const order = readyOrders.splice(orderIndex, 1)[0];

            localStorage.setItem('readyOrders', JSON.stringify(readyOrders));

            updateOrders();
            showNotification(`Order for ${order.customerName} is complete!`);
        }
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.className = 'notification show';
        setTimeout(() => {
            notification.className = 'notification';
        }, 3000);
    }

    logoutButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Initial update
    updateOrders();

    // Update orders every 30 seconds
    setInterval(updateOrders, 30000);
});