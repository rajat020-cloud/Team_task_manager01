import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  title: string;
  description?: string;
  assignedTo?: mongoose.Types.ObjectId | any;
  projectId: mongoose.Types.ObjectId | any;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "InProgress" | "Completed";
  dueDate?: Date;
  createdBy: mongoose.Types.ObjectId | any;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Todo", "InProgress", "Completed"], default: "Todo" },
    dueDate: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
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

taskSchema.virtual("assignee", {
  ref: "User",
  localField: "assignedTo",
  foreignField: "_id",
  justOne: true,
});

taskSchema.virtual("creator", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

taskSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

export const Task = mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);
export default Task;
