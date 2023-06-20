import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models'; // Assuming you have a user model defined
import type { IUser } from '../models';
import { createUserValidation, loginUserValidation } from '../validations';

const register = async (req: Request, res: Response): Promise<void> => {
  const validation = createUserValidation(req.body);
  const { error } = validation;

  // * check for validation
  if (error) {
    res.status(400).send(error?.details?.[0].message);
    return;
  }

  const { name, email, password, avatar } = req.body;

  // Check if the email is already registered
  const existingUser: IUser | null = await User.findOne({ email });
  if (existingUser) {
    res.status(400).send({ message: 'Email already exists' });
    return;
  }

  // Hash the password
  const hashedPassword: string = await bcrypt.hash(password, 10);

  // Create the user object
  const user: IUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  // Save the user to the database

  try {
    //Save user to DB
    const newUser = await user.save();

    //Create and Assign Token
    // Generate JWT token
    const token: string = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET as string
    );

    res.header('Authorization', token).send({ token, user });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = loginUserValidation(req.body);
    const { error } = validation;

    // * check for validation

    if (error) {
      res.status(400).send(error?.details?.[0].message);
      return;
    }

    const { email, password } = req.body;

    // Check if the email exists in the database
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(401).send({ message: 'Invalid email or password' });
      return;
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (!passwordMatch) {
      res.status(401).send({ message: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const token: string = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string
    );

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

export interface AuthRequest extends Request {
  userId?: string;
}
const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    // Find the user by ID in the database
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    // Return the user's data
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

export { register, login, me };
