const serVer = `https://checklist-app-backend.vercel.app`;
const token = localStorage.getItem("qc-users");

// fetch logged in user
export const fetchUser = async () => {
  const response = await fetch(`${serVer}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// fetch all users
export const fetchUsers = async () => {
  const response = await fetch(`${serVer}/users`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// fetch all checklists
export const fetchChecklists = async () => {
  const response = await fetch(`${serVer}/fetchChecklists`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// fetch all user entry
export const fetchUserEntry = async () => {
  const response = await fetch(`${serVer}/fetchUserEntry`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// fetch all notifications
export const fetchNotifications = async () => {
  const response = await fetch(`${serVer}/fetchNotifications`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
