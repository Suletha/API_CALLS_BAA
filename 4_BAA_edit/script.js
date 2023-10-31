document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone_no');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const userDetailsDisplay = document.getElementById('userDetailsDisplay');

    // Function to make a GET request and display user details
    function displayUserDetails() {
        axios.get('https://crudcrud.com/api/7a77743b4eeb476b969680810b3191c0/booking_app_app')
            .then(response => {
                // Check if there are saved user details
                if (response.data.length > 0) {
                    userDetailsDisplay.innerHTML = '<h2>Saved Appointments:</h2>';
                    response.data.forEach(user => {
                        const editButton = `<button class="edit-button" data-id="${user._id}">Edit</button>`;
                        const deleteButton = `<button class="delete-button" data-id="${user._id}">Delete</button>`;
                        userDetailsDisplay.innerHTML += `
                            <p><strong>Name:</strong> ${user.name}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Phone:</strong> ${user.phone}</p>
                            <p><strong>Time for Call:</strong> ${user.time}</p>
                            ${editButton}
                            ${deleteButton}
                            <hr>
                        `;
                    });
                } else {
                    userDetailsDisplay.innerHTML = 'No saved appointments yet.';
                }
            })
            .catch(error => {
                userDetailsDisplay.innerHTML = 'Error: Unable to retrieve user details.';
                console.error(error);
            });
    }

    // Function to populate the form with user details for editing
    function populateFormWithUserData(userId) {
        axios.get(`https://crudcrud.com/api/7a77743b4eeb476b969680810b3191c0/booking_app_app/${userId}`)
            .then(response => {
                const userData = response.data;
                nameInput.value = userData.name;
                emailInput.value = userData.email;
                phoneInput.value = userData.phone;
                const dateTimeParts = userData.time.split(' ');
                dateInput.value = dateTimeParts[0];
                timeInput.value = dateTimeParts[1];
                form.dataset.userId = userId;
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Call the function to display user details when the DOM loads
    displayUserDetails();

    // Add a click event listener to the user details display div to handle edit and delete clicks
    userDetailsDisplay.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-button')) {
            const userId = event.target.getAttribute('data-id');
            populateFormWithUserData(userId);
        } else if (event.target.classList.contains('delete-button')) {
            const userId = event.target.getAttribute('data-id');
            axios.delete(`https://crudcrud.com/api/7a77743b4eeb476b969680810b3191c0/booking_app_app/${userId}`)
                .then(response => {
                    event.target.previousElementSibling.remove(); // Remove the <hr> element
                    event.target.remove(); // Remove the delete button
                })
                .catch(error => {
                    console.error(error);
                });
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const userId = form.dataset.userId;
        if (userId) {
            // Update existing user
            const userData = {
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                time: `${dateInput.value} ${timeInput.value}`
            };
            axios.put(`https://crudcrud.com/api/7a77743b4eeb476b969680810b3191c0/booking_app_app/${userId}`, userData)
                .then(response => {
                    userDetailsDisplay.innerHTML = 'User details successfully updated.';
                    form.reset();
                    form.removeAttribute('data-user-id');
                    displayUserDetails();
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            // Create a new user
            const userData = {
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                time: `${dateInput.value} ${timeInput.value}`
            };
            axios.post('https://crudcrud.com/api/7a77743b4eeb476b969680810b3191c0/booking_app_app', userData)
                .then(response => {
                    userDetailsDisplay.innerHTML = 'User details successfully submitted.';
                    form.reset();
                    displayUserDetails();
                })
                .catch(error => {
                    userDetailsDisplay.innerHTML = 'Error: User details submission failed.';
                    console.error(error);
                });
        }
    });
});
