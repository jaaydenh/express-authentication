import { object, string } from "zod";

export const updateUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    displayName: string({
      required_error: "Display Name is required",
    }),
  }),
});
