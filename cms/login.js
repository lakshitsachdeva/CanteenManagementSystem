document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = new URLSearchParams(window.location.search).get('role');

        // Simple authentication logic (replace with server-side authentication in a real application)
        if (role === 'admin' && username === 'admin' && password === 'admin123') {
            localStorage.setItem('username', username);
            localStorage.setItem('userType', 'admin');
            window.location.href = 'admin.html';
        } else if (role === 'customer') {
            // Check if it's a staff login
            if (username==='sofiamaam'&& password === 'sofia123') {
                localStorage.setItem('username', username);
                localStorage.setItem('userType', 'staff');
                window.location.href = 'customer.html';
            } else if (username==='student' && password === 'student123') {
                localStorage.setItem('username', username);
                localStorage.setItem('userType', 'student');
                window.location.href = 'customer.html';
            } else {
                loginError.textContent = 'Invalid username or password';
            }
        } else {
            loginError.textContent = 'Invalid username or password';
        }
    });
});