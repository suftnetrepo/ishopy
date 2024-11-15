/**
 * Validates a value against provided rules.
 * @param {any} value - The value to validate.
 * @param {Array} rules - The array of validation rules.
 * @returns {string|undefined} The error message if the value is invalid, otherwise undefined.
 */
const validateField = (value, rules) => {
  for (const rule of rules) {
    if (rule.array) {
      // Checks if value is a non-empty array
      if (Array.isArray(value) && value.length === 0) {
        return rule.message;
      }
    } else if (!rule.pattern.test(value)) {
      // Checks if value matches the rule pattern
      return rule.message;
    }
  }

  return undefined;
};

/**
 * Validates a set of values against a set of field rules.
 * @param {Object} values - The object of field values.
 * @param {Object} rules - The object of field rules.
 * @returns {Object} An object containing a boolean indicating if there are errors, and an object of errors.
 */
const validate = (values, rules) => {
  const errors = {};
  let hasError = false;

  for (const field in rules) {
    const fieldRules = rules[field];
    const value = values[field];
    const error = validateField(value, fieldRules);

    if (error) {
      hasError = true;
      errors[field] = { message: error };
    }
  }

  return {
    hasError,
    errors,
  };
};

export { validate };
