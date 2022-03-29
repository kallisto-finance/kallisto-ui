export function GetRemainDays(currentTime, endTime) {
  const remainTime = endTime - currentTime

  if (remainTime <= 0) {
    return { day: 0, hour: 0, minute: 0 }
  }

  const day = Math.floor(remainTime / (86400 * 1000))
  const dayTime = remainTime - (day * 86400 *1000)

  const hour = Math.floor(dayTime / (3600 * 1000))
  const minute = Math.floor((dayTime - hour * 3600 * 1000) / (60 * 1000))

  return {
    day,
    hour,
    minute
  }
}

export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const dateOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

const dateOptionsWithWeekDay = {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long" 
} as const;

const timeOptions = {
  hour12: true,
  hour: "2-digit",
  minute: "2-digit",
} as const;

export const convertDateString = (dateStr) => {
  const stamp = Date.parse(dateStr);
  const date = new Date(stamp);

  return date.toLocaleDateString("en-US", dateOptions);
};

export const convertDateStringWithWeekDay = (dateStr) => {
  const stamp = Date.parse(dateStr);
  const date = new Date(stamp);

  return date.toLocaleDateString("en-US", dateOptionsWithWeekDay);
};

export const convertTimeString = (dateStr) => {
  const stamp = Date.parse(dateStr);
  const date = new Date(stamp);

  return date.toLocaleDateString("en-US", timeOptions).split(",")[1].trim();
};