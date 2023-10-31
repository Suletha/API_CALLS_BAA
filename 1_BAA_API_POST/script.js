document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone_no');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const userDetailsDisplay = document.getElementById('userDetailsDisplay');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const userData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            time: `${dateInput.value} ${timeInput.value}`
        };

        axios.post('https://crudcrud.com/api/7a77743b4eeb476b969680810b3191c0/booking_app_app', userData)
            .then(response => {
                userDetailsDisplay.innerHTML = 'User details successfully submitted.';
                // Optionally, you can clear the form inputs here
                nameInput.value = '';
                emailInput.value = '';
                phoneInput.value = '';
                dateInput.value = '';
                timeInput.value = '';
            })
            .catch(error => {
                userDetailsDisplay.innerHTML = 'Error: User details submission failed.';
                console.error(error);
            });
    });
});
