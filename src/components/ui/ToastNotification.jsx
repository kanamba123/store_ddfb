// src/utils/ToastNotification.js
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  return <ToastContainer position="bottom-right" autoClose={3000} />;
};

// Exportez des méthodes pour afficher les différents types de notifications
export const notifySuccess = (message) => toast.success(message);
export const notifyError = (message) => toast.error(message);
export const notifyInfo = (message) => toast.info(message);

export default ToastNotification;
