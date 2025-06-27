// Script to clear authentication data
console.log('Clearing authentication data...');
localStorage.removeItem('token');
localStorage.removeItem('user');
console.log('Authentication data cleared. You can now log in again.');
