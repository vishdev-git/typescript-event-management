import { IAdminService } from "./IAdminService";
import { LoginRequest } from "../models/Student";
import Event from "../models/Event";
import Student from "../models/Student";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AdminService implements IAdminService {
  async login(
    request: LoginRequest
  ): Promise<{ token: string; isAdmin: boolean }> {
    try {
      const user = await Student.findOne({ where: { email: request.email } });

      // User not found
      if (!user) {
        throw new Error("Invalid email or password.");
      }
      // User is not an admin
      if (!user.isAdmin) {
        throw new Error("Access denied. You are not authorized as an admin.");
      }

      // Password does not match
      const isMatch = await bcrypt.compare(request.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password.");
      }

      // Generate JWT token for admin
      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        process.env.ADMIN_JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return { token, isAdmin: user.isAdmin };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error logging in admin: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred during admin login");
      }
    }
  }

  async addEvent(eventData: {
    date: Date;
    name: string;
    description: string;
  
  }): Promise<void> {
    try {
      // Add the event to the database using the Event model
      await Event.create(eventData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error adding event: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while adding event");
      }
    }
  }

  async editEvent(
    id: number,
    eventData: {
        date: Date;
        name: string;
        description: string;
    
    }
  ): Promise<void> {
    try {
      await Event.update(eventData, { where: { id } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error updating event: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while updating event");
      }
    }
  }

  async deleteEvent(id: number): Promise<void> {
    try {
      await Event.destroy({ where: { id } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error deleting event: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while deleting event");
      }
    }
  }

  async manageUsers(): Promise<any> {
    try {
      return await Student.findAll();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving users: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while retrieving users");
      }
    }
  }

  async blockUser(id: number): Promise<void> {
    try {
      const user = await Student.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }
      user.isblocked = true;
      await user.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error blocking user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while blocking user");
      }
    }
  }
  
  async unblockUser(id: number): Promise<void> {
    try {
      const user = await Student.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }
      user.isblocked = false;
      await user.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error unblocking user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while unblocking user");
      }
    }
  }
  
}
