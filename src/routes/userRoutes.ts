// userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateJWT, redirectIfLoggedIn } from '../middleware/authMiddleware';
import { UserService } from '../services/UserService';

const router = Router();
const userService = new UserService(); // Create an instance of UserService
const userController = new UserController(userService); // Pass the instance to UserController

router.get('/signup', redirectIfLoggedIn, userController.renderSignupPage);
router.post('/signup', userController.signupUser);
router.get('/login', redirectIfLoggedIn, userController.renderLoginPage);
router.post('/login', userController.loginUser);
router.get('/dashboard', authenticateJWT, userController.renderDashboard);

// Join an event
router.post('/events/join/:eventId', authenticateJWT, userController.joinEvent);
router.post('/events/unjoin/:eventId', authenticateJWT, userController.unjoinEvent);
router.post('/logout', authenticateJWT, userController.logoutUser);

export default router;
