import bcrypt from "bcrypt";
import { User, type IUser, type Settings } from "../db/models/user";

export async function createUser({ username, password }: IUser) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  return await user.save();
}

export async function getUser(id: string) {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("Пользователь не найден");
  return user;
}

export async function updateUser(userId: string, settings: Settings) {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { settings } },
    { new: true, runValidators: true },
  ).select("-password");
  return updatedUser;
}

export async function loginUser({ username, password }: IUser) {
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) throw new Error("Пользователь не найден");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Неверный пароль");

  return user;
}
