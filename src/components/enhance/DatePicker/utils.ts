import dayjs from "dayjs";

export const dateToString = (date: Date) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const stringToDate = (str: string) => {
  return new Date(str);
};
