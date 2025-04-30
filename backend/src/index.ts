// backend/src/index.ts
import 'express-async-errors'; // This must be the first import!
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorMiddleware';
import { AppDataSource } from './data-source';
// Import your routes
import dailyCheckInRoutes from './routes/dailyCheckInRoutes';
import chatRoutes from './routes/chatRoutes';
import achievementRoutes from './routes/achievementRoutes';

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/check-ins', dailyCheckInRoutes);
// Add other routes here
app.use('/api/chat', chatRoutes);
app.use('/api/achievements', achievementRoutes);

// Error handler - MUST be after all routes and middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
