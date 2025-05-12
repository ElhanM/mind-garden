import 'express-async-errors'; // This must be the first import!
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorMiddleware';
import { AppDataSource } from './data-source';

import dailyCheckInRoutes from './routes/dailyCheckInRoutes';
import wpRoutes from './routes/wpRoutes';
import chatRoutes from './routes/chatRoutes';
import achievementRoutes from './routes/achievementRoutes';
import { sendSuccess } from './utils/responseHandlers';

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
const whitelist = [
  'http://localhost:3000',
  'https://mind-garden.hyper6xhurmasice.online',
  'http://mind-garden.hyper6xhurmasice.online',
];
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    console.log('Request from origin:', origin); // Add this line for debugging
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Rejecting request from unauthorized origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/health', (_req, res) => {
  sendSuccess(res, 'Server is healthy!');
});
app.use('/api/check-ins', dailyCheckInRoutes);
app.use('/api/wp', wpRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/achievements', achievementRoutes);

// Error handler - MUST be after all routes and middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
