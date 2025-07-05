import express from 'express';
import { getPayloadHMR } from 'payload/hmr';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend connections
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));

// Initialize Payload
const start = async (): Promise<void> => {
  // Initialize Payload
  const payload = await getPayloadHMR({
    importMap: new Map([
      ['payload', 'payload'],
    ]),
  });

  // Add your own express routes here
  app.get('/', (_, res) => {
    res.redirect('/admin');
  });

  // Add Payload's admin and API routes
  app.use(payload.authenticate);

  app.listen(PORT, async () => {
    console.log(`✅ Server listening on port ${PORT}`);
    console.log(`🔗 Admin panel: http://localhost:${PORT}/admin`);
    console.log(`🚀 API: http://localhost:${PORT}/api`);
    console.log(`📊 Blog API: http://localhost:${PORT}/api/blogs`);
  });
};

start().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
}); 