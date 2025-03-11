export default function compareDatesWithoutTimestamp(todayCheckIn: any) {
  if (todayCheckIn) {
    return (
      new Date(todayCheckIn.createdAt).getFullYear() === new Date().getFullYear() &&
      new Date(todayCheckIn.createdAt).getMonth() === new Date().getMonth() &&
      new Date(todayCheckIn.createdAt).getDate() === new Date().getDate()
    );
  }
  return false;
}
