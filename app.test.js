const VotingEligibilityChecker = require('./app');

describe('Voting Eligibility Checker', () => {
    let checker;

    beforeEach(() => {
        checker = new VotingEligibilityChecker();
    });

    describe('Citizenship Validation', () => {
        test('should return error when citizenship is not selected', () => {
            const result = checker.validateCitizenship(null);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please select your citizenship status');
        });

        test('should return valid when citizenship is selected', () => {
            const result = checker.validateCitizenship('yes');
            expect(result.isValid).toBe(true);
        });
    });

    describe('Age Validation', () => {
        test('should return error when age is empty', () => {
            const result = checker.validateAge('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Age is required');
        });

        test('should return error when age is just spaces', () => {
            const result = checker.validateAge('   ');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Age is required');
        });

        test('should return error when age contains letters', () => {
            const result = checker.validateAge('25abc');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Age must contain only numbers');
        });

        test('should return error when age contains special characters', () => {
            const result = checker.validateAge('25@#$');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Age must contain only numbers');
        });

        test('should return error when age contains spaces within numbers', () => {
            const result = checker.validateAge('25 30');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Age must contain only numbers');
        });

        test('should return error when age has leading zeros', () => {
            const result = checker.validateAge('030');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Age cannot have leading zeros');
        });

        test('should return error when age has multiple leading zeros', () => {
            const result = checker.validateAge('0030');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Age cannot have leading zeros');
        });

        test('should accept zero when it\'s a single digit', () => {
            const result = checker.validateAge('0');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid age between 1 and 150');
        });

        test('should return error when age is negative', () => {
            const result = checker.validateAge('-5');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Age must contain only numbers');
        });

        test('should return error when age is zero', () => {
            const result = checker.validateAge('0');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid age between 1 and 150');
        });

        test('should return error when age is too high', () => {
            const result = checker.validateAge('151');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid age between 1 and 150');
        });

        test('should return valid for correct numeric age', () => {
            const result = checker.validateAge('25');
            expect(result.isValid).toBe(true);
            expect(result.age).toBe(25);
        });

        test('should accept 18 as valid age', () => {
            const result = checker.validateAge('18');
            expect(result.isValid).toBe(true);
            expect(result.age).toBe(18);
        });
    });

    describe('Eligibility Check with Multiple Errors', () => {
        test('should show both errors when not citizen AND under 18', () => {
            const result = checker.checkEligibility('no', '17');
            
            expect(result.eligible).toBe(false);
            expect(result.errors.length).toBe(2);
            expect(result.errors[0].message).toBe('❌ You must be a South African citizen to vote');
            expect(result.errors[1].message).toBe('❌ You must be 18 years or older to vote');
        });

        test('should show both validation errors when citizenship missing AND age invalid', () => {
            const result = checker.checkEligibility(null, 'abc');
            
            expect(result.eligible).toBe(false);
            expect(result.errors.length).toBe(2);
            expect(result.errors[0].message).toBe('Please select your citizenship status');
            expect(result.errors[1].message).toBe('Age must contain only numbers');
        });

        test('should show both validation errors when citizenship missing AND age has leading zeros', () => {
            const result = checker.checkEligibility(null, '030');
            
            expect(result.eligible).toBe(false);
            expect(result.errors.length).toBe(2);
            expect(result.errors[0].message).toBe('Please select your citizenship status');
            expect(result.errors[1].message).toBe('Age cannot have leading zeros');
        });
    });

    describe('Single Eligibility Checks', () => {
        test('should be eligible when citizen and over 18', () => {
            const result = checker.checkEligibility('yes', '25');
            expect(result.eligible).toBe(true);
            expect(result.message).toBe('✅ You are eligible to vote in South Africa!');
            expect(result.errors.length).toBe(0);
        });

        test('should be eligible when citizen and exactly 18', () => {
            const result = checker.checkEligibility('yes', '18');
            expect(result.eligible).toBe(true);
            expect(result.message).toBe('✅ You are eligible to vote in South Africa!');
        });

        test('should show only citizenship error when not citizen but over 18', () => {
            const result = checker.checkEligibility('no', '25');
            
            expect(result.eligible).toBe(false);
            expect(result.errors.length).toBe(1);
            expect(result.errors[0].message).toBe('❌ You must be a South African citizen to vote');
        });

        test('should show only age error when citizen but under 18', () => {
            const result = checker.checkEligibility('yes', '17');
            
            expect(result.eligible).toBe(false);
            expect(result.errors.length).toBe(1);
            expect(result.errors[0].message).toBe('❌ You must be 18 years or older to vote');
        });

        test('should handle missing citizenship selection', () => {
            const result = checker.checkEligibility(null, '25');
            
            expect(result.eligible).toBe(false);
            expect(result.errors.length).toBe(1);
            expect(result.errors[0].message).toBe('Please select your citizenship status');
        });

        test('should handle invalid age input with letters', () => {
            const result = checker.checkEligibility('yes', 'abc');
            
            expect(result.eligible).toBe(false);
            expect(result.errors.length).toBe(1);
            expect(result.errors[0].message).toBe('Age must contain only numbers');
        });

        test('should handle empty age input', () => {
            const result = checker.checkEligibility('yes', '');
            
            expect(result.eligible).toBe(false);
            expect(result.errors.length).toBe(1);
            expect(result.errors[0].message).toBe('Age is required');
        });
    });
});