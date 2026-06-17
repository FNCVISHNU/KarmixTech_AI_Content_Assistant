/**
 * Validates the input data to ensure all required fields are present and not empty.
 * @param {Object} data The input request body.
 * @returns {string[]} Array of missing field names.
 */
export function validateInput(data) {
  const requiredFields = [
    "content_type",
    "topic",
    "audience",
    "tone",
    "platform",
    "goal"
  ];

  const missing = [];
  for (const field of requiredFields) {
    const val = data[field];
    if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
      missing.push(field);
    }
  }

  return missing;
}
