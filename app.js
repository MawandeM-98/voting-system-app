class VotingEligibilityChecker {
    constructor() {
        this.setupEventListeners();
    }

    validateCitizenship(citizenship) {
        if (!citizenship) {
            return { isValid: false, error: 'Please select your citizenship status' };
        }
        return { isValid: true };
    }

    validateAge(ageInput) {
        // Check if empty
        if (!ageInput || ageInput.trim() === '') {
            return { isValid: false, error: 'Age is required' };
        }

        // Remove leading/trailing spaces
        const trimmedAge = ageInput.trim();

        // Check if it contains only digits (no letters, spaces, special characters)
        if (!/^\d+$/.test(trimmedAge)) {
            return { isValid: false, error: 'Age must contain only numbers' };
        }

        const age = parseInt(trimmedAge, 10);

        // Check if it's a valid number and within reasonable range
        if (isNaN(age) || age <= 0 || age > 150) {
            return { isValid: false, error: 'Please enter a valid age between 1 and 150' };
        }

        return { isValid: true, age };
    }

    checkEligibility(citizenship, ageInput) {
        // Validate citizenship first
        const citizenshipValidation = this.validateCitizenship(citizenship);
        if (!citizenshipValidation.isValid) {
            return { 
                eligible: false, 
                error: citizenshipValidation.error,
                field: 'citizenship'
            };
        }

        // Validate age
        const ageValidation = this.validateAge(ageInput);
        if (!ageValidation.isValid) {
            return { 
                eligible: false, 
                error: ageValidation.error,
                field: 'age'
            };
        }

        const age = ageValidation.age;

        // Check voting eligibility
        if (citizenship === 'yes' && age >= 18) {
            return { 
                eligible: true, 
                message: '✅ You are eligible to vote in South Africa!',
                field: null
            };
        } else if (citizenship !== 'yes') {
            return { 
                eligible: false, 
                error: '❌ You are not eligible to vote: You must be a South African citizen',
                field: 'citizenship'
            };
        } else if (age < 18) {
            return { 
                eligible: false, 
                error: '❌ You are not eligible to vote: You must be 18 years or older',
                field: 'age'
            };
        }
    }

    displayResult(result) {
        const resultDiv = document.getElementById('result');
        const citizenshipError = document.getElementById('citizenshipError');
        const ageError = document.getElementById('ageError');

        // Clear previous errors
        citizenshipError.textContent = '';
        ageError.textContent = '';

        if (result.eligible) {
            resultDiv.className = 'result success';
            resultDiv.textContent = result.message;
        } else {
            resultDiv.className = 'result error';
            resultDiv.textContent = result.error;
            
            // Display field-specific error
            if (result.field === 'citizenship') {
                citizenshipError.textContent = result.error;
            } else if (result.field === 'age') {
                ageError.textContent = result.error;
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const checkButton = document.getElementById('checkEligibility');
            
            checkButton.addEventListener('click', () => {
                const citizenship = document.querySelector('input[name="citizenship"]:checked')?.value;
                const age = document.getElementById('age').value;

                const result = this.checkEligibility(citizenship, age);
                this.displayResult(result);
            });

            // Clear errors when user starts typing/selecting
            document.getElementById('age').addEventListener('input', () => {
                document.getElementById('ageError').textContent = '';
                document.getElementById('result').style.display = 'none';
            });

            document.querySelectorAll('input[name="citizenship"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    document.getElementById('citizenshipError').textContent = '';
                    document.getElementById('result').style.display = 'none';
                });
            });
        });
    }
}

// Initialize the app
new VotingEligibilityChecker();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VotingEligibilityChecker;
}