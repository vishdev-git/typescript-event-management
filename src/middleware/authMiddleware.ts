import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

// Middleware to check if the user is authenticated
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.user_token || ''; // Retrieve token from cookies

  if (token) {
    jwt.verify(token, process.env.USER_JWT_SECRET!, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        console.log('Session expired, please log in again.');
        return res.redirect('/login?message=Session expired, please log in again.');
      }
      (req as any).user = decoded; // Add user info to request
      next();
    });
  } else {
    res.redirect('/login');
  }
};

// Middleware to check if the user is logged in and redirect if accessing login/signup
export const redirectIfLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.user_token || '';

  if (token) {
    jwt.verify(token, process.env.USER_JWT_SECRET!, (err: VerifyErrors | null) => {
      if (!err) {
        return res.redirect('/dashboard');
      }
      next();
    });
  } else {
    next();
  }
};
