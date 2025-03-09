import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null, // Puedes usar un valor por defecto para imágenes opcionales
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Valida el formato del correo
    },
    password: {
      type: String,
      required: true,
    },
    ages: {
      type: [String],
      required: true,
    },
    languages: {
      type: [String], 
      required: true,
    },
    preferences: {
      type: [String],
      required: true,
    },
    ubication: {
      country: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      longitude: {
        type: Number,
        required: false,
      },
      latitude: {
        type: Number,
        required: false,
      }
    },
  },
  { timestamps: true }
);

// Exporta el modelo
export const User = mongoose.model("User", UserSchema);
