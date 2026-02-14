import mongoose, { Types } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  roles: ("participant" | "volunteer" | "admin" | "super_admin")[];
  passwordHash?: string;
  image?: string;
  avatar?: number;
  provider: "google" | "credentials";
  emailVerified?: Date;
  verified?: boolean;
  amongUsScore?: number;
  createdAt: Date;
  updatedAt: Date;
  fullName?: string;
  phoneNumber?: string;
  college?: string;
  stream?: string;
  isProfileComplete: boolean;
}

export interface ISpoc {
  name: string;
  contact: string;
}

export interface IEvent {
  eventName: string;
  category: "Software" | "Hardware" | "Entrepreneurship";
  description: string;
  banner: string;
  rules: string[];
  clubs: string[];
  spocs: ISpoc[];
  registrations: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventProps {
  _id: Types.ObjectId;
  eventName: string;
  category: "Software" | "Hardware" | "Entrepreneurship";
  description: string;
  banner: string;
  clubs: string[];
  __v: number;
}

export interface PublicEventProps {
  _id: string;
  eventName: string;
  category: string;
  description: string;
  banner: string;
  clubs: string[];
  date: string;
  time: string;
  venue: string;
  isTeamEvent: boolean;
  membersPerTeam: number;
  __v: number;
}

export interface EventByIdProps {
  _id: Types.ObjectId;
  eventName: string;
  category: "Software" | "Hardware" | "Entrepreneurship";
  description: string;
  banner: string;
  rules: string[];
  clubs: string[];
  spocs: ISpoc[];
  __v: number;
}
