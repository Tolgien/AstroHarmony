import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertContactMessageSchema, insertBirthChartSchema } from "@shared/schema";
import nodemailer from "nodemailer";

// For development - use a test SMTP server
const devTransporter = {
  sendMail: async (mailOptions: any) => {
    console.log("Email would be sent:", mailOptions);
    return { success: true };
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefix all with /api
  const apiRouter = app;

  // Zodiac Signs API
  apiRouter.get("/api/zodiac-signs", async (_req: Request, res: Response) => {
    try {
      const zodiacSigns = await storage.getAllZodiacSigns();
      res.json(zodiacSigns);
    } catch (error) {
      res.status(500).json({ message: "Error fetching zodiac signs" });
    }
  });

  apiRouter.get("/api/zodiac-signs/:name", async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      const zodiacSign = await storage.getZodiacSignByName(name);
      
      if (!zodiacSign) {
        return res.status(404).json({ message: "Zodiac sign not found" });
      }
      
      res.json(zodiacSign);
    } catch (error) {
      res.status(500).json({ message: "Error fetching zodiac sign" });
    }
  });

  // Blog Posts API
  apiRouter.get("/api/blog-posts", async (_req: Request, res: Response) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });

  apiRouter.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const blogPost = await storage.getBlogPostBySlug(slug);
      
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  // User API
  apiRouter.post("/api/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // In a real app, we would hash the password here
      const user = await storage.createUser(validatedData);
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  });

  apiRouter.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Validate required fields
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real app, we would compare hashed passwords
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error during login" });
      }
    }
  });

  // Contact API
  apiRouter.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Store contact message
      const message = await storage.createContactMessage(validatedData);
      
      // Send email notification (in development, just log)
      try {
        await devTransporter.sendMail({
          from: validatedData.email,
          to: "contact@astrosight.com", // This would be your company email
          subject: `Contact Form: ${validatedData.subject}`,
          text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nMessage: ${validatedData.message}`
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Continue anyway, we've stored the message
      }
      
      res.status(201).json({
        message: "Your message has been sent successfully!",
        contactId: message.id
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error submitting contact form" });
      }
    }
  });

  // Birth Chart API
  apiRouter.post("/api/birth-charts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBirthChartSchema.parse(req.body);
      
      const birthChart = await storage.createBirthChart(validatedData);
      
      res.status(201).json(birthChart);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error creating birth chart" });
      }
    }
  });

  apiRouter.get("/api/users/:userId/birth-charts", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const birthCharts = await storage.getBirthChartsByUserId(userId);
      
      res.json(birthCharts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching birth charts" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
