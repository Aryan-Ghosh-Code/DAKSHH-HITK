import { IEvent } from "@/types/interface";
import mongoose, { model, Schema } from "mongoose";
import { models } from "mongoose";

export interface IEventDocument extends IEvent, mongoose.Document {
    _id: mongoose.Types.ObjectId;
}

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    category: {
        type: String,
        enum: ["Software", "Hardware", "Entrepreneurship"],
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    banner: {
        type: String,
        default: "",
    },
    rules: {
        type: [String],
        default: [],
    },
    clubs: {
        type: [String],
        default: [],
    },
    isTeamEvent: {
        type: Boolean,
        required: true,
        default: false
    },
    pocs: [
        {
            name: {
                type: String,
                required: true
            },
            mobile: {
                type: String,
                required: true
            }
        }
    ],
    membersPerTeam: {
        type: Number,
        required: true
    },
    isPaidEvent: {
        type: Boolean,
        required: true
    },
    fees: {
        type: Number,
        default: 0
    },
    registrations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Registration",
        }
    ]
},
    { timestamps: true }
);

const Event =
    models.Event ?? model<IEventDocument>("Event", eventSchema);

export default Event;