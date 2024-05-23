import express from 'express';
import router from './routes/posts.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

const port = process.env.PORT;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use('/api/posts', router);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
