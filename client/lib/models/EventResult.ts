import mongoose, { model, Schema, models, Document } from "mongoose";

export interface IResultParticipant {
  name: string;
  userId?: mongoose.Types.ObjectId;
}

export interface IResultEntry {
  _id?: mongoose.Types.ObjectId;
  position: "winner" | "runner_up" | "second_runner_up" | "honorable_mention";
  positionLabel?: string;
  rank: number;
  teamId?: mongoose.Types.ObjectId;
  registrationId?: mongoose.Types.ObjectId;
  teamName?: string;
  participants: IResultParticipant[];
  note?: string;
}

export interface IEventResult {
  eventId: mongoose.Types.ObjectId;
  eventName: string;
  eventBanner?: string;
  eventCategory?: string;
  entries: IResultEntry[];
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventResultDocument extends IEventResult, Document {
  _id: mongoose.Types.ObjectId;
}

const resultParticipantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const resultEntrySchema = new Schema(
  {
    position: {
      type: String,
      enum: ["winner", "runner_up", "second_runner_up", "honorable_mention"],
      required: true,
    },
    positionLabel: { type: String, trim: true },
    rank: { type: Number, default: 1 },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
    teamName: { type: String, trim: true },
    participants: [resultParticipantSchema],
    note: { type: String, trim: true },
  },
  { _id: true }
);

const eventResultSchema = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true,
    },
    eventName: { type: String, required: true, trim: true },
    eventBanner: { type: String },
    eventCategory: { type: String },
    entries: [resultEntrySchema],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

const EventResult =
  models.EventResult ||
  model<IEventResultDocument>("EventResult", eventResultSchema);

export default EventResult;
