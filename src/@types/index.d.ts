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

type TransactionType = "earn" | "redeem";
type TransactionSource = "purchase" | "reward" | "campaign";

export interface TransactionBase {
  referenceId: string;
  establishmentId?: string;
  userId?: string;
  createdById: string;
  createdByRole: UserRole;
  amount: number;
  source: TransactionSource;
  type: TransactionType;
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
  qrTransactionId: string;
  userId: string;
}

export interface QrCode {
  id: string;
  expiresAt: Date;
  version: number;
  payload: string;
}

export interface TransactionForm {
  referenceId: string;
  source: TransactionSource;
  type: TransactionType;
  amount: number;
}

export interface ContainerProps {
  children?: React.ReactNode;
  maxWidth?: "full" | "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
  className?: string;
}
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label: string;
  error?: FieldError;
}

export interface CreateQrTransactionInput {
  user: User | null;
  referenceId: string;
  source: TransactionSource;
  type: TransactionType;
  amount: number;
}

export interface AuthContextProps {
  user: User | null;
  loading: boolean;
}

export type TransactionStatus =
  "pending" | "completed" | "cancelled" | "expired";

export interface TransactionFilters {
  userId?: string;
  employeeId?: string;
  establishmentId?: string;
  createdById?: string;

  campaignId?: string;
  rewardId?: string;
  referenceId?: string;

  type?: TransactionType;
  source?: TransactionSource;
  status?: TransactionStatus;

  startDate?: Timestamp;
  endDate?: Timestamp;
}

export interface GetTransactionsInput {
  filters?: TransactionFilters;
  limit: number;
  cursor?: DocumentSnapshot;
}
