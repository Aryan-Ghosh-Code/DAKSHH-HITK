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
    spocs: [
        {
            name: {
                type: String,
                required: true
            },
            contact: {
                type: String,
                required: true
            }
        }
    ],
    registrations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]
},
    { timestamps: true }
);

const Event =
    models.Event ?? model<IEventDocument>("Event", eventSchema);

export default Event;