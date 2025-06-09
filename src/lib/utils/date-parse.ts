import dayjs from "dayjs";
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const FORMAT = "D.M.YYYY";

export function parseDate(dateString: string): Date | null {
  const parsedDate = dayjs(dateString, FORMAT);
  return parsedDate.isValid() ? parsedDate.toDate() : null;
}
