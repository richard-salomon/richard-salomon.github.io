ocument.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('food-form');
    const additionalMealsDiv = document.getElementById('additional-meals');
    const addMealButton = document.getElementById('add-meal-button');
    let mealCount = 0;

    // Load saved user ID if available
    const savedUserId = localStorage.getItem('foodTrackerUserId');
    if (savedUserId) {
        document.getElementById('user-id').value = savedUserId;
    }

    // Add meal functionality
    addMealButton.addEventListener('click', () => {
        mealCount++;
        const mealDiv = document.createElement('div');
        mealDiv.className = 'form-group meal-entry';
        mealDiv.innerHTML = `
            <label for="extra-meal-${mealCount}">Additional Meal ${mealCount}:</label>
            <div class="input-group">
                <input type="text" 
                    id="extra-meal-${mealCount}" 
                    name="extra-meal-${mealCount}" 
                    placeholder="What did you eat?">
                <button type="button" class="remove-meal-btn">
                    Remove Meal
                </button>
            </div>
        `;

        // Add remove functionality
        const removeButton = mealDiv.querySelector('.remove-meal-btn');
        removeButton.addEventListener('click', () => {
            mealDiv.remove();
        });

        additionalMealsDiv.appendChild(mealDiv);
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get and save user ID
        const userId = document.getElementById('user-id').value;
        localStorage.setItem('foodTrackerUserId', userId);

        // Collect form data
        const formData = new FormData(form);
        const userData = {
            date: new Date().toISOString().split('T')[0],
            userId: userId,
            timestamp: new Date().toISOString()
        };

        // Add non-empty form fields to userData
        formData.forEach((value, key) => {
            if (value.trim() !== '') {
                userData[key] = value.trim();
            }
        });

        try {
            // Create CSV data
            const csv = Papa.unparse([userData], {
                quotes: true,
                header: true
            });

            // Create and download file
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const filename = `food-log-${userData.date}-${userId}.csv`;
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            // Create and show completion message
            const completionMessage = document.createElement('div');
            completionMessage.className = 'completion-message';
            completionMessage.innerHTML = `
                <div class="success-card">
                    <div class="success-icon">✓</div>
                    <h2>Successfully Logged!</h2>
                    <div class="success-details">
                        <p>Your food log has been saved and downloaded.</p>
                        <p class="date">Date: ${new Date().toLocaleDateString()}</p>
                        <p class="filename">File: ${filename}</p>
                    </div>
                    <div class="action-buttons">
                        <button onclick="location.reload()" class="secondary-button">
                            Log Another Day
                        </button>
                        <a href="index.html" class="primary-button">
                            Return Home
                        </a>
                    </div>
                </div>
            `;

            // Hide form and show completion message
            form.style.display = 'none';
            form.parentNode.appendChild(completionMessage);

        } catch (error) {
            // Error handling
            console.error('Error processing submission:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'There was an error processing your submission. Please try again.';
            form.insertBefore(errorMessage, form.firstChild);
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        }
    });
});