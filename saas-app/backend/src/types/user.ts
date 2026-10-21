// Formato do documento "User" salvo no MongoDB.
export interface IUser {
  email: string;
  password: string; // hash do bcrypt, nunca a senha pura
  // Criados automaticamente pelo Mongoose por causa de { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}
