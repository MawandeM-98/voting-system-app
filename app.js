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

        // Check for leading zeros (like "030")
        if (trimmedAge.length > 1 && trimmedAge.startsWith('0')) {
            return { isValid: false, error: 'Age cannot have leading zeros' };
        }

        const age = parseInt(trimmedAge, 10);

        // Check if it's a valid number and within reasonable range
        if (isNaN(age) || age <= 0 || age > 150) {
            return { isValid: false, error: 'Please enter a valid age between 1 and 150' };
        }

        return { isValid: true, age };
    }

    checkEligibility(citizenship, ageInput) {
        const errors = [];
        let age = null;
        let isCitizen = citizenship === 'yes';
        
        // Validate citizenship
        const citizenshipValidation = this.validateCitizenship(citizenship);
        if (!citizenshipValidation.isValid) {
            errors.push({
                field: 'citizenship',
                message: citizenshipValidation.error
            });
        }

        // Validate age
        const ageValidation = this.validateAge(ageInput);
        if (!ageValidation.isValid) {
            errors.push({
                field: 'age',
                message: ageValidation.error
            });
        } else {
            age = ageValidation.age;
        }

        // If there are validation errors, return them all
        if (errors.length > 0) {
            return {
                eligible: false,
                errors: errors,
                hasValidationErrors: true
            };
        }

        // Check eligibility criteria (both must be true)
        const eligibilityErrors = [];
        
        if (!isCitizen) {
            eligibilityErrors.push({
                field: 'citizenship',
                message: '❌ You must be a South African citizen to vote'
            });
        }
        
        if (age < 18) {
            eligibilityErrors.push({
                field: 'age',
                message: '❌ You must be 18 years or older to vote'
            });
        }

        // If there are eligibility errors, return them all
        if (eligibilityErrors.length > 0) {
            return {
                eligible: false,
                errors: eligibilityErrors,
                hasValidationErrors: false
            };
        }

        // All conditions met - eligible to vote
        return {
            eligible: true,
            message: '✅ You are eligible to vote in South Africa!',
            errors: []
        };
    }

    displayResult(result) {
        const resultDiv = document.getElementById('result');
        const citizenshipError = document.getElementById('citizenshipError');
        const ageError = document.getElementById('ageError');

        // Clear previous errors
        citizenshipError.textContent = '';
        ageError.textContent = '';
        citizenshipError.style.display = 'none';
        ageError.style.display = 'none';

        if (result.eligible) {
            resultDiv.className = 'result success';
            resultDiv.textContent = result.message;
            resultDiv.style.display = 'block';
        } else {
            resultDiv.className = 'result error';
            
            // Display all errors
            if (result.errors && result.errors.length > 0) {
                // Create a combined error message
                const errorMessages = result.errors.map(err => err.message).join(' ');
                resultDiv.textContent = errorMessages;
                
                // Also show field-specific errors
                result.errors.forEach(error => {
                    if (error.field === 'citizenship') {
                        citizenshipError.textContent = error.message;
                        citizenshipError.style.display = 'block';
                    } else if (error.field === 'age') {
                        ageError.textContent = error.message;
                        ageError.style.display = 'block';
                    }
                });
            }
            resultDiv.style.display = 'block';
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
                document.getElementById('ageError').style.display = 'none';
                document.getElementById('result').style.display = 'none';
            });

            document.querySelectorAll('input[name="citizenship"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    document.getElementById('citizenshipError').textContent = '';
                    document.getElementById('citizenshipError').style.display = 'none';
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