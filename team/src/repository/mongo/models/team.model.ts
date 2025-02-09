import mongoose, { HydratedDocument, Model } from "mongoose";
import { ITeam } from "../../../interfaces/entity.interface.js";

const teamSchema = new mongoose.Schema<ITeam>(
    {
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        project: {
            type: String,
            required: true,
        },
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

export type IDBTeam = HydratedDocument<
    ITeam,
    { createdAt: Date; updatedAt: Date }
>;

export type ITeamModel = Model<ITeam>;

export default mongoose.model<ITeam>("Team", teamSchema);
