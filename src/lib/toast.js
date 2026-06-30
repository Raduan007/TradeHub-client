// src/lib/toast.js
import { toast } from "react-hot-toast";

export const success = (msg) => toast.success(msg, {
  // Customize as needed, e.g., duration, style
});

export const error = (msg) => toast.error(msg, {
  // Customize as needed
});

export const info = (msg) => toast(msg, {
  // Customize as needed
});
