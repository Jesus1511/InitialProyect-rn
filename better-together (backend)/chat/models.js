import mongoose from "mongoose";

// Esquema de chat que almacena los mensajes como un objeto
const ChatSchema = new mongoose.Schema(
  {
    users: [
      {
        _id: String,
        name: {
          type: String,
          required: true,
        },
      },
    ],
    notReadedMessages: [
      {
        user: {
          name: {
            type: String,
            required: true,
          },
          _id: String,
        },
        content: {
          type: String,
          required: true
        },
        creationDate: {
          type: Date,
          default: Date.now, 
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Chats = mongoose.model("Chat", ChatSchema);
