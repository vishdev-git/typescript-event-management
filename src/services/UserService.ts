import { IUserService } from "./IUserService";
import {
  SignupRequest,
  LoginRequest,
  SignupResponse,
  LoginResponse,
} from "../models/Student";
import Student from "../models/Student";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserEvent from "../models/UserEvent";
import EventModel from "../models/Event";

export class UserService implements IUserService {
  // Method to handle user signup
  async signup(request: SignupRequest): Promise<SignupResponse> {
    try {
      // Check if passwords match
      if (request.password !== request.retypePassword) {
        throw new Error("Passwords do not match");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(request.password, 10);

      // Create a new user
      const user = await Student.create({
        fullName: request.fullName,
        email: request.email,
        phoneNumber: request.phoneNumber,
        password: hashedPassword,
        isAdmin: false,
        isblocked: false,
      });

      return {
        message: "User created successfully",
        user: { id: user.id, email: user.email },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error signing up user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred during signup");
      }
    }
  }

  // Method to handle user login
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      // Find user by email
      const user = await Student.findOne({ where: { email: request.email } });
      if (!user) {
        throw new Error("Invalid email or password");
      }
      console.log("Fetched user details:", user);
      if (user && user.isblocked) {
        
        throw new Error("Your account is blocked. Please contact support.");
      }

      // Compare password
      const isMatch = await bcrypt.compare(request.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.USER_JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return {
        message: "Login successful",
        token,
        id: user.id,
        email: user.email,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error logging in user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred during login");
      }
    }
  }

  // Method to fetch all events
  async fetchEvents(
    userId: number
  ): Promise<{ allEvents: EventModel[]; joinedEvents: EventModel[] }> {
    try {
      // Fetch all events
      const allEvents = await EventModel.findAll();

      // Fetch events joined by the user
      const joinedEventIds = await UserEvent.findAll({
        where: { userId },
        attributes: ["eventId"],
      });

      const joinedEvents = await EventModel.findAll({
        where: {
          id: joinedEventIds.map((ue) => ue.eventId),
        },
      });

      return { allEvents, joinedEvents };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error fetching events: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching events");
      }
    }
  }

  // Method to join an event
  async joinEvent(userId: number, eventId: number): Promise<void> {
    try {
      const existing = await UserEvent.findOne({ where: { userId, eventId } });
      if (existing) {
        throw new Error("User already joined this event");
      }

      await UserEvent.create({ userId, eventId });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error joining event: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while joining the event");
      }
    }
  }

  public async unjoinEvent(userId: number, eventId: number): Promise<void> {
    // Logic to remove the user from the event
    await UserEvent.destroy({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
  }
}
