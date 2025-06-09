document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const submitBtn = form.querySelector('.submit-btn');
    const resultCard = document.getElementById('result');
    const predictionText = document.getElementById('predictionText');
    const resultIcon = document.querySelector('.result-icon');

    // API endpoint
    const API_URL = 'http://localhost:8000/predict';

    // Form validation
    function validateForm() {
        const inputs = form.querySelectorAll('input');
        let isValid = true;

        inputs.forEach(input => {
            const value = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);

            if (isNaN(value) || value < min || value > max) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // Show loading state
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    // Show result
    function showResult(prediction) {
        const isDiabetic = prediction.prediction === 1;
        predictionText.textContent = isDiabetic
            ? 'You are Diabetic – Please consult a doctor.'
            : 'You are Not Diabetic – Stay healthy!';
        
        resultIcon.className = 'result-icon' + (isDiabetic ? ' diabetic' : '');
        resultCard.classList.remove('hidden');
        resultCard.classList.add('show');
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill in all fields with valid values.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = parseFloat(value);
            });

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to get prediction');
            }

            const prediction = await response.json();
            showResult(prediction);
        } catch (error) {
            alert(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    });

    // Real-time validation
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const value = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);

            if (isNaN(value) || value < min || value > max) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
    });
}); 