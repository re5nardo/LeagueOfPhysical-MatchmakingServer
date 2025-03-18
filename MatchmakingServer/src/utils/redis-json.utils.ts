
const ISO_DATE_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

export const dateReviver = (key: string, value: any): any => {
  if (typeof value === 'string' && ISO_DATE_FORMAT.test(value)) {
    return new Date(value);
  }
  return value;
};

export const parseWithDates = <T>(json: string): T => {
  return JSON.parse(json, dateReviver);
};
