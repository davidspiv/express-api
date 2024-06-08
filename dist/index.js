import express from 'express';
import router from './routes/transactions.js';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import cors from 'cors';
const port = process.env.PORT;
const app = express();
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use(cors());
app.use('/api/transactions', router);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
