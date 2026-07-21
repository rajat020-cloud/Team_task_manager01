import mongoose, { Schema, Document } from "mongoose";

export interface IProjectMember {
  user: mongoose.Types.ObjectId | any;
}

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  title: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId | any;
  members: IProjectMember[];
  createdAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: (doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

projectSchema.virtual("creator", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

projectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "projectId",
});

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
export default Project;
