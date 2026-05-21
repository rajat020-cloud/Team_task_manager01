import app from '../backend/src/index';

// Vercel will call the default export as a request handler.
// Express apps are functions that accept (req, res), so we can export
// the app instance directly.

export default app as any;
