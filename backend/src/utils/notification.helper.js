import Notification from "../models/Notification.model.js";

export const createNotification = async ({
  user,
  title,
  message,
  type
}) => {
  await Notification.create({
    user,
    title,
    message,
    type
  });
};
