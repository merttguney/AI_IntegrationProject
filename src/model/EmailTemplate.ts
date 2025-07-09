import mongoose, { Document, Schema } from "mongoose";

export interface IEmailTemplate extends Document {
  templateId: string;
  websiteId: string;
  operationType: "create" | "update" | "delete";
  templateName: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[]; // Array of variable names used in template
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema: Schema = new Schema(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    websiteId: {
      type: String,
      required: true,
      index: true,
    },
    operationType: {
      type: String,
      required: true,
      enum: ["create", "update", "delete"],
      index: true,
    },
    templateName: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    textContent: {
      type: String,
      required: false,
    },
    variables: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "email_templates",
  }
);

// Compound index for efficient querying by websiteId, operationType, and isActive
EmailTemplateSchema.index({ websiteId: 1, operationType: 1, isActive: 1 });

export const EmailTemplate = mongoose.model<IEmailTemplate>(
  "EmailTemplate",
  EmailTemplateSchema
);
