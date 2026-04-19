export const logger = {
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[pluginbase]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[pluginbase]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error('[pluginbase]', ...args);
  }
};
