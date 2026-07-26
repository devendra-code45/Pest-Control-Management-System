import api from "./axios";

export const changePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  const response = await api.put(
    "/users/change-password",
    {
      oldPassword,
      newPassword,
      confirmPassword,
    }
  );

  return response.data;
};