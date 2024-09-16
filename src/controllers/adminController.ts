import { Request, Response } from "express";
import { IAdminService } from "../services/IAdminService";
import { LoginRequest } from "../models/Student";
import { UserEvent, Student, Event } from "../models";

export class AdminController {
  constructor(private adminService: IAdminService) {}

  // Handle admin login
  public loginAdmin = async (req: Request, res: Response) => {
    const request: LoginRequest = req.body;
    try {
      const { token, isAdmin } = await this.adminService.login(request);

      // Check if user is admin
      if (isAdmin) {
        // Set token in cookies
        res.cookie("admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000,
        }); // 1 hour expiry

        // Log session creation
        console.log(`Admin logged in: ${request.email}, Token: ${token}`);

        // Redirect to dashboard
        res.redirect("/admin/dashboard");
      } else {
        // User is not an admin, return error message
        res.status(403).render("adminLogin", {
          message: "Access denied. You are not authorized as an admin.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Login failed: either invalid email/password or another issue
        res.status(401).render("adminLogin", { message: error.message });
      } else {
        // Unexpected error
        res
          .status(500)
          .render("adminLogin", { message: "An unknown error occurred." });
      }
    }
  };

  // Render admin login page
  public renderLoginPage = (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store");
    const message = req.query.message as string;
    res.render("adminLogin", { message, error: null });
  };

  // Render admin dashboard
  public async renderDashboard(req: Request, res: Response): Promise<void> {
    try {
      // Fetch events with their participations
      const events = await Event.findAll();

      const eventsWithParticipation = await Promise.all(
        events.map(async (event) => {
          const totalStudents = await UserEvent.count({
            where: { eventId: event.id },
          });
          const students = await UserEvent.findAll({
            where: { eventId: event.id },
            include: [
              {
                model: Student,
                as: "Student",
                attributes: ["fullName"],
              },
            ],
            // Pagination
            limit: 10, // Number of students per page
            offset: parseInt(req.query.page as string, 10) * 10 || 0, // Page offset
          });

          return {
            eventName: event.name,
            eventDate: event.date,
            totalStudents,
            students: students.map((studentEvent) => studentEvent.Student),
            hasPrevPage: parseInt(req.query.page as string, 10) > 0,
            hasNextPage:
              totalStudents > (parseInt(req.query.page as string, 10) + 1) * 10,
            prevPageUrl: `/admin/dashboard?page=${
              parseInt(req.query.page as string, 10) - 1
            }`,
            nextPageUrl: `/admin/dashboard?page=${
              parseInt(req.query.page as string, 10) + 1
            }`,
          };
        })
      );

      res.render("adminDashboard", { eventsWithParticipation });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({
          message: `Error retrieving dashboard data: ${error.message}`,
        });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  // Handle admin logout
  public logoutAdmin = (req: Request, res: Response) => {
    res.clearCookie("admin_token"); // Clear the admin token cookie
    res.redirect("/admin/login?message=Logged out successfully"); // Redirect with success message
  };
  // Render page to add an event
  public renderAddEventPage = (req: Request, res: Response) => {
    res.render("adminAddEvent");
  };

  // Handle adding an event
  public addEvent = async (req: Request, res: Response) => {
    const { date, name, description } = req.body; // Use date and name
    try {
      await this.adminService.addEvent({ date, name, description });
      res.redirect("/admin/dashboard?message=Event added successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: `Error adding event: ${error.message}` });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

  public renderEventListPage = async (req: Request, res: Response) => {
    try {
      const events = await Event.findAll();
      res.render("adminEventList", { events });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: `Error retrieving events: ${error.message}` });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

  public renderEditEventPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const event = await Event.findOne({ where: { id } });
      if (event) {
        res.render("adminEditEvent", { event });
      } else {
        res
          .status(404)
          .render("adminDashboard", { message: "Event not found" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: `Error retrieving event: ${error.message}` });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

  // Handle editing an event
  public editEvent = async (req: Request, res: Response) => {
    const { eventId, date, eventName, eventDescription } = req.body;
    try {
      const idNumber = parseInt(eventId, 10);
      if (isNaN(idNumber)) {
        res.status(400).json({ message: "Invalid event ID" });
        return;
      }

      await this.adminService.editEvent(idNumber, {
        date,
        name: eventName,
        description: eventDescription,
      });
      res.redirect("/admin/dashboard?message=Event updated successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: `Error updating event: ${error.message}` });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

  // Handle deleting an event
  public deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const idNumber = parseInt(id, 10);
      if (isNaN(idNumber)) {
        res.status(400).json({ message: "Invalid event ID" });
        return;
      }

      await this.adminService.deleteEvent(idNumber);
      res.redirect("/admin/dashboard?message=Event deleted successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: `Error deleting event: ${error.message}` });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

  // Render page to manage users
  public renderManageUsersPage = async (req: Request, res: Response) => {
    try {
      const students = await this.adminService.manageUsers();
      res.render("adminManageUser", { users: students });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: `Error retrieving users: ${error.message}` });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

  public blockUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await this.adminService.blockUser(parseInt(id, 10));
      res.redirect("/admin/manage-users?message=User blocked successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: `Error blocking user: ${error.message}` });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

  public unblockUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await this.adminService.unblockUser(parseInt(id, 10));
      res.redirect("/admin/manage-users?message=User unblocked successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: `Error unblocking user: ${error.message}` });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };
}
