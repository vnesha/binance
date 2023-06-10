export function formatDateAndTime(time: string, timezoneOffsetHours = 2) {
    const date = new Date(time);
    date.setHours(date.getUTCHours() + timezoneOffsetHours);
  
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed in JS
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
  
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }
  