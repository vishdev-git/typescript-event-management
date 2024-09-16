import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

// Middleware to check if the admin is authenticated
export const authenticateAdminJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.admin_token || ''; // Retrieve token from cookies

  if (token) {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET!, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        return res.redirect('/admin/login?message=Session expired, please log in again.');
      }

      // Check if the user is an admin
      const decodedToken = decoded as JwtPayload;
      if (decodedToken.isAdmin) {
        (req as any).user = decodedToken; // Add admin info to request
        next();
      } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
    });
  } else {
    res.redirect('/admin/login');
  }
};

// Middleware to redirect to dashboard if admin is already logged in
export const redirectIfAdminLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.admin_token || '';

  if (token) {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET!, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (!err) {
        const decodedToken = decoded as JwtPayload;
        if (decodedToken.isAdmin) {
          return res.redirect('/admin/dashboard');
        }
      }
      next();
    });
  } else {
    next();
  }
};
