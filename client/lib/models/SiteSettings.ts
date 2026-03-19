import mongoose, { model, Schema, models, Document } from "mongoose";

export interface ISiteSettings {
  key: string;
  value: unknown;
  updatedAt: Date;
}

export interface ISiteSettingsDocument extends ISiteSettings, Document {
  _id: mongoose.Types.ObjectId;
}

const siteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const SiteSettings =
  models.SiteSettings ||
  model<ISiteSettingsDocument>("SiteSettings", siteSettingsSchema);

export default SiteSettings;
