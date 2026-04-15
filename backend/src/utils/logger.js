/**
 * @fileoverview Logger utility for the backend.
 * A simple wrapper that only logs messages and errors in development mode.
 */

/**
 * Logs output to the console if the environment is not production.
 * @param {...any} args - The values/messages to log
 */
export const logger = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DEV LOG]:', ...args);
  }
};
