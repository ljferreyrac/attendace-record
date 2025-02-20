export const getUTCMinus5Date = (date = new Date()) => {
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth();
  const utcDate = date.getUTCDate();
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcSeconds = date.getUTCSeconds();
  const utcMilliseconds = date.getUTCMilliseconds();

  const utcDateConverted = Date.UTC(
    utcYear,
    utcMonth,
    utcDate,
    utcHours,
    utcMinutes,
    utcSeconds,
    utcMilliseconds
  );

  const utcMinus5Date = new Date(utcDateConverted);

  return utcMinus5Date;
};

export const formatToDatabaseDate = (dateString: string) => {
  const parts = dateString.split("/");

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  const formattedYear = date.getFullYear();
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
  const formattedDay = String(date.getDate()).padStart(2, "0");

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
};

export const formatToDisplayDate = (dateString: string) => {
  const parts = dateString.split("-");

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  return `${String(day).padStart(2, "0")}/${String(month).padStart(
    2,
    "0"
  )}/${year}`;
};
