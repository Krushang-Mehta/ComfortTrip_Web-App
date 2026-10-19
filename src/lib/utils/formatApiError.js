/**
 * Centralized API and Validation Error Formatter
 * Sanitizes technical error objects (Zod, Mongoose, Mongo duplicate key, Auth)
 * into friendly, natural-language error messages for end users.
 */

export function formatErrorResponse(error) {
  // 1. Zod Validation Errors
  if (error?.name === 'ZodError' || error?.issues) {
    const issues = error.errors || error.issues || [];
    const fieldErrors = {};
    const errorList = [];

    issues.forEach((issue) => {
      const field = issue.path?.join('.') || 'general';
      const cleanMessage = sanitizeErrorMessage(issue.message, field);
      fieldErrors[field] = cleanMessage;
      errorList.push({ field, message: cleanMessage });
    });

    const primaryMessage =
      errorList[0]?.message || 'Please check your inputs and try again.';

    return {
      status: 400,
      body: {
        success: false,
        message: primaryMessage,
        errors: errorList,
        fieldErrors,
      },
    };
  }

  // 2. MongoDB Duplicate Key (E11000)
  if (error?.code === 11000 || error?.name === 'MongoServerError') {
    const field = Object.keys(error.keyPattern || {})[0] || 'record';
    const capitalized = field.charAt(0).toUpperCase() + field.slice(1);
    return {
      status: 409,
      body: {
        success: false,
        message: `An account with this ${field} already exists. Please sign in or use another ${field}.`,
        fieldErrors: { [field]: `${capitalized} already in use.` },
      },
    };
  }

  // 3. Known Application Errors
  const knownMessages = {
    EMAIL_ALREADY_EXISTS: 'An account with this email address already exists. Please sign in.',
    INVALID_CREDENTIALS: 'The email address or password you entered is incorrect.',
    ACCOUNT_SUSPENDED: 'Your account has been deactivated. Please contact support.',
    PLEASE_LOGIN_WITH_GOOGLE: 'This account was created with Google. Please use Google Sign In.',
    UNAUTHENTICATED: 'Your session has expired. Please sign in again.',
    FORBIDDEN_ADMIN_ACCESS_REQUIRED: 'Administrator privileges are required to access this area.',
  };

  if (knownMessages[error?.message]) {
    return {
      status: error.statusCode || 400,
      body: {
        success: false,
        message: knownMessages[error.message],
      },
    };
  }

  // 4. Fallback Default
  return {
    status: error?.statusCode || 500,
    body: {
      success: false,
      message: error?.message || 'An unexpected error occurred. Please try again.',
    },
  };
}

/**
 * Clean up specific error messages to make them easily understandable for standard users
 */
function sanitizeErrorMessage(rawMessage, field) {
  if (!rawMessage) return 'Invalid value provided.';

  // Password guidance
  if (field === 'password' && rawMessage.includes('regex')) {
    return 'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special symbol (e.g. @, #, $, %).';
  }

  // Phone guidance
  if (field === 'phone' && (rawMessage.includes('regex') || rawMessage.includes('phone'))) {
    return 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
  }

  return rawMessage;
}
