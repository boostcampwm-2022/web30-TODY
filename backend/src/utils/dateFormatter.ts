const zeroFormatter = (number: number) => {
  return number > 9 ? number : `0${number}`;
};

export function dateFormatter(date: Date) {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  const second = dateObj.getSeconds();
  const dateString = `${year}-${zeroFormatter(month)}-${zeroFormatter(
    day,
  )} ${zeroFormatter(hour)}:${zeroFormatter(minute)}:${zeroFormatter(second)}`;
  return dateString;
}
