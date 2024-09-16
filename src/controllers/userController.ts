import { Request, Response } from "express";
import { IUserService } from "../services/IUserService";
import { SignupRequest, LoginRequest } from "../models/Student";

export class UserController {
  constructor(private userService: IUserService) {}

  public signupUser = async (req: Request, res: Response) => {
    const request: SignupRequest = req.body;
    try {
      await this.userService.signup(request);
      res.redirect(`/login?message=Signup successful`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

  public loginUser = async (req: Request, res: Response) => {
    const request: LoginRequest = req.body;
    try {
      const user = await this.userService.login(request);
      const token = user.token; // Token from the login response

      // Set token in cookies
      res.cookie("user_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      }); // 1 hour expiry

      console.log(`Session started for user: ${user.email}`);
      res.redirect('/dashboard'); // Redirect to dashboard after login
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(401).render("login", { message: null, error: "Login failed. Invalid email or password." });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

  public renderSignupPage = (req: Request, res: Response) => {
    res.render("signup");
  };

  public renderLoginPage = (req: Request, res: Response) => {
    const message = (req.query.message as string) || null;
    res.render("login", { message, error: null });
  };

  public renderDashboard = async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (user) {
      try {
        // Fetch all events and joined events
        const { allEvents, joinedEvents } = await this.userService.fetchEvents(user.id);

        // Render the dashboard with user data, allEvents, and joinedEvents
        res.render("dashboard", { user, allEvents, joinedEvents });
      } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/login");
    }
  };

  public joinEvent = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const eventId = parseInt(req.params.eventId, 10);

    if (user) {
      try {
        await this.userService.joinEvent(user.id, eventId);
        res.redirect("/dashboard"); // Redirect to dashboard after joining the event
      } catch (error) {
        console.error("Error joining event:", error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/login");
    }
  };

  public unjoinEvent = async (req: Request, res: Response) => {
    const user = (req as any).user; // Extract user info from JWT

    if (user) {
      try {
        const eventId = parseInt(req.params.eventId, 10);  // Event ID from URL params

        await this.userService.unjoinEvent(user.id, eventId);  // Call the service to unjoin the event

        return res.redirect('/dashboard');  // Redirect to the dashboard after unjoining
      } catch (error) {
        console.error('Error unjoining from event:', error);
        return res.status(500).send('Error unjoining from the event.');
      }
    } else {
      res.redirect("/login");
    }
  };

  public logoutUser = (req: Request, res: Response) => {
    res.clearCookie("user_token"); // Clear the user token cookie
    res.redirect("/login?message=Logged out successfully"); // Redirect with success message
  };
  
}
