import mongoose, { HydratedDocument } from "mongoose";
import { IProject } from "../interfaces/entity.interface.js";

const projectSchema = new mongoose.Schema<IProject>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        priority: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
            default: new Date(),
        },
        dueDate: {
            type: Date,
            default: new Date(),
        },
        projectLead: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Member",
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Member",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export type IDBProject = HydratedDocument<
    IProject,
    { createdAt: Date; updatedAt: Date }
>;

export default mongoose.model<IProject>("Project", projectSchema);
