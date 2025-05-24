import cors from 'cors';

const whitelist = [
  'http://localhost:3000',
  'https://mind-garden.hyper6xhurmasice.online',
  'http://mind-garden.hyper6xhurmasice.online',
];
export const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Rejecting request from unauthorized origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
};
