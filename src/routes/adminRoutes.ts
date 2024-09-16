import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateAdminJWT, redirectIfAdminLoggedIn } from '../middleware/adminAuthMiddleware';
import { AdminService } from '../services/AdminService';

const router = Router();
const adminService = new AdminService(); 
const adminController = new AdminController(adminService); 

// Auth routes
router.get('/login', redirectIfAdminLoggedIn, adminController.renderLoginPage); 
router.post('/login', adminController.loginAdmin); 
router.get('/dashboard', authenticateAdminJWT, adminController.renderDashboard); 
router.get('/logout', authenticateAdminJWT, adminController.logoutAdmin); 

// Event management routes
router.get('/add-event', authenticateAdminJWT, adminController.renderAddEventPage);
router.get('/edit-event',authenticateAdminJWT, adminController.renderEventListPage); 
router.post('/add-event', authenticateAdminJWT, adminController.addEvent); 
router.get('/edit-event/:id',authenticateAdminJWT, adminController.renderEditEventPage);
router.post('/edit-event',authenticateAdminJWT, adminController.editEvent);
router.post('/delete-event/:id',authenticateAdminJWT, adminController.deleteEvent);

// User management routes
router.get('/manage-users', authenticateAdminJWT, adminController.renderManageUsersPage); 
router.post('/block-user/:id', authenticateAdminJWT, adminController.blockUser);
router.post('/unblock-user/:id', authenticateAdminJWT, adminController.unblockUser);


export default router;
