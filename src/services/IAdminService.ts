import { LoginRequest } from '../models/Student';
// Uncomment this if you need to use Event in the service or elsewhere
// import { Event } from '../models/Event';

export interface IAdminService {
    // Admin login method
    login(request: LoginRequest): Promise<{ token: string; isAdmin: boolean }>;
  
    // Add new event method with corrected field names
    addEvent(eventData: { date: Date; name: string; description: string; }): Promise<void>;
  
    // Edit event method with corrected field names
    editEvent(id: number, eventData: { date: Date; name: string; description: string;}): Promise<void>;
  
    // Delete event method
    deleteEvent(id: number): Promise<void>;
  
    // Manage users method, update return type as necessary
    manageUsers(): Promise<any>;
  
    // Block a user
    blockUser(id: number): Promise<void>;
  
    // Unblock a user
    unblockUser(id: number): Promise<void>;
  }
  
