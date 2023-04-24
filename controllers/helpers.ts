import bcrypt from "bcrypt";

import { User } from "../models/users";

export async function authenticate({ email, password }: {
    email: string;
    password: string;
}) {
    const user = await User.scope('withPassword').findOne({ where: { email }});
    if (!user) {
        return false;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return false;
    }

    return user;
}