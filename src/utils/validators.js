export const getErrorMessage = (command) => {
  if (!command || command.trim() === '') {
    return 'Please enter a dice command (e.g., "2d6+1")';
  }

  const trimmed = command.trim();

  if (trimmed.length > 100) {
    return 'Command too long (max 100 characters)';
  }

  return null;
};