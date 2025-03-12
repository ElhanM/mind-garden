export default function compareDatesWithoutTimestamp(createdAt: Date) {
  return (
    new Date(createdAt).getFullYear() === new Date().getFullYear() &&
    new Date(createdAt).getMonth() === new Date().getMonth() &&
    new Date(createdAt).getDate() === new Date().getDate()
  );
}
