const successMessages = {
    default: "Success!",
    login: "Login successful!",
    signup: "Signup successful!",
    logout: "Logout successful!",
    attended: "You are now attending this event!",
    unAttended: "You are no longer attending this event!",
    eventCreated: "Event created successfully!",
    eventUpdated: "Event updated successfully!",
    eventDeleted: "Event deleted successfully!",
    favoriteAdded: "Event added to favorites!",
    favoriteRemoved: "Event removed from favorites!",
    eventNotFound: "Event not found!",
    userNotFound: "User not found!",
};
const errorMessages = {
    default: "An unexpected error occurred. Please try again later!",
    login: "Login failed. Please check your credentials.",
    signup: "Signup failed. Please check your details.",
    logout: "Logout failed. Please try again.",
    attended: "Failed to join the event. Please try again.",
    unAttended: "Failed to leave the event. Please try again.",
    eventCreated: "Failed to create the event. Please try again.",
    eventUpdated: "Failed to update the event. Please try again.",
    eventDeleted: "Failed to delete the event. Please try again.",
    eventNotFound: "Event not found. Please check the event ID.",
    invalidCredentials: "Invalid credentials. Please try again.",
    userNotFound: "User not found. Please check the username or email.",
    favoriteAdded: "Failed to add event to favorites. Please try again.",
    favoriteRemoved: "Failed to remove event from favorites. Please try again.",
};

export { successMessages, errorMessages };