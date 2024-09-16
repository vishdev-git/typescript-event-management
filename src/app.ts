import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import cookieParser from 'cookie-parser'; 
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', userRoutes); // Authentication routes
app.use('/admin', adminRoutes);

app.use((req, res, next) => {
    res.status(404).render('404'); // Render the 404.ejs template
});

// Global error handling middleware (optional)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack); // Log the error
    res.status(500).send('Something broke!'); // Render a 500 error page or message
});

// Sync all models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database connected and models synced');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
