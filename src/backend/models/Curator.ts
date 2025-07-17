import { Document, Schema, model, models } from 'mongoose';

// Interface for the Curator document
export interface ICurator extends Document {
  name: string;
  role: string; 
  bio: string;
  image: string;
  isActive: boolean;
}

// Mongoose schema for the Curator
const CuratorSchema = new Schema<ICurator>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create and export the Curator model
const Curator = models.Curator || model<ICurator>('Curator', CuratorSchema);
export default Curator;
