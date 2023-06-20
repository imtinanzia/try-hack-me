import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    // Add the authenticated user ID to the request object
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth;
