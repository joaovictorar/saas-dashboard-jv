import { Schema, model } from "mongoose";
import type { IUser } from "../types/user";

// Schema<IUser> liga o schema à interface: o TS reclama se um campo
// do schema não existir em IUser, e User.findOne() devolve documentos
// com `email` e `password` tipados.
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const User = model<IUser>("User", UserSchema);
