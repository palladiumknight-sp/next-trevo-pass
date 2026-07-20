import { FieldValue, Timestamp } from "firebase/firestore";
import { InputHTMLAttributes } from "react";

// USER (Base, Create, Read, Update)

export interface UserBase {
  id?: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role?: UserRole;
}

export type UserRole = "customer" | "employee" | "manager" | "admin";

export interface UserCreate extends UserBase {
  id: string;
  role: UserRole;
  establishmentId?: string;
  points: number;
  totalPointsEarned: number;
  level: "bronze" | "silver" | "gold" | "vip";
  status: "active" | "inactive" | "suspended" | "deleted";
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface UserRead extends UserBase {
  id: string;
  role: UserRole;
  establishmentId?: string;
  points: number;
  totalPointsEarned: number;
  level: "bronze" | "silver" | "gold" | "vip";
  status: "active" | "inactive" | "suspended" | "deleted";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type UserUpdate = Partial<UserRead>;

export interface UserForm extends UserBase {
  password: string;
  confirmPassword: string;
}

//TRANSACTION (Base, Create, Read, Update)
export interface TransactionBase {
  referenceId: string;
  establishmentId?: string;
  customerId?: string;
  createdBy: string;
  createdByType: UserRole;
  amount: number;
  source: "purchase" | "reward" | "campaign";
  type: "earn" | "redeem" | "bonus";
  version: number;
}

export interface TransactionCreate extends TransactionBase {
  createdAt: FieldValue;
  updatedAt: FieldValue;
  expiresAt: Timestamp;
  usedAt: null;
}

export interface TransactionRead extends TransactionBase {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt: Timestamp;
  usedAt: Timestamp | null;
}

export type TransactionUpdate = Partial<TransactionRead>;

export interface TransactionUser extends TransactionRead {
  qrTransactionId: string;
}

export interface CreateTransactionInput {
  transactionId: string;
  customerId: string;
}

export interface QrCode {
  id: string;
  expiresAt: Date;
  version: number;
  payload: string;
}

export type EventType = "purchase" | "reward" | "campaign";

export interface TransactionForm {
  event: EventType;
  referenceId: string;
  amount: number;
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label: string;
  error?: FieldError;
}

export interface CreateQrTransactionInput {
  user: User | null;
  event: EventType;
  referenceId: string;
  amount: number;
}

export interface AuthContextProps {
  user: User | null;
  loading: boolean;
}
