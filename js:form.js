document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('food-form');
    const additionalMealsDiv = document.getElementById('additional-meals');
    const addMealButton = document.getElementById('add-meal-button');
    let mealCount = 0;

    // Load saved user ID
    const savedUserId = localStorage.getItem('foodTrackerUserId');
    if (savedUserId) {
        document.getElementById('user-id').value = savedUserId;
    }

    // Add meal functionality
    addMealButton.addEventListener('click', () => {
        mealCount++;
        const mealDiv = document.createElement('div');
        mealDiv.className = 'form-group';
        mealDiv.innerHTML = `
            <label for="extra-meal-${mealCount}">Additional Meal ${mealCount}:</label>
            <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="extra-meal-${mealCount}" name="extra-meal-${mealCount}" 
                    placeholder="What did you eat?">
                <button type="button" class="secondary-button remove-meal">Remove</button>
            </div>
        `;

        mealDiv.querySelector('.remove-meal').addEventListener('click', () => {
            mealDiv.remove();
        });

        additionalMealsDiv.appendChild(mealDiv);
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Save user ID
        const userId = document.getElementById('user-id').value;
        localStorage.setItem('foodTrackerUserId', userId);

        // Collect form data
        const formData = new FormData(form);
        const userData = {
            date: new Date().toISOString().split('T')[0],
            userId: userId
        };

        formData.forEach((value, key) => {
            if (value.trim() !== '') {
                userData[key] = value.trim();
            }
        });

        // Create CSV
        const csv = Papa.unparse([userData], {
            quotes: true,
            header: true
        });

        // Save file
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const filename = `food-log-${userData.date}-${userId}.csv`;
        
        // Store data for completion page
        sessionStorage.setItem('lastLog', JSON.stringify({
            date: new Date().toLocaleDateString(),
            filename: filename
        }));

        // Download file
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Redirect to completion page
        window.location.href = 'completion.html';
    });
});

<!-- js/completion.js -->
document.addEventListener('DOMContentLoaded', () => {
    const lastLog = JSON.parse(sessionStorage.getItem('lastLog'));
    
    if (lastLog) {
        document.getElementById('log-date').textContent = lastLog.date;
        document.getElementById('file-name').textContent = lastLog.filename;
    } else {
        window.location.href = 'form.html';
    }
});

