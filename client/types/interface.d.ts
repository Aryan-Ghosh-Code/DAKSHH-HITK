import mongoose, { Types } from "mongoose";

export interface IUser {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
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