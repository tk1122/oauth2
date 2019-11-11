import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { User } from '../models/schema/User';
import bcrypt from 'bcrypt';

const createUser = async (req: Request, res: Response, next: any): Promise<Response> => {
    const { password, username, name, age, email, identityNumber, creditCard } = req.body;
    const userRepo = getConnection().getRepository(User);

    const hashedPass = await bcrypt.hash(password.toString(), 10);
    const user = userRepo.create({
        password: hashedPass,
        name,
        username,
        age,
        email,
        identityNumber,
        creditCard
    });

    await userRepo.save(user);

    return res.json({
        name: user.name,
        username: user.username,
        age: user.age,
        email: user.email
    });
};

export const userController = {
    createUserHandler: createUser
};
