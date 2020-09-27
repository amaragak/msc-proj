import moment from "moment";

export function endAfterStart(times: { startTime: string, endTime: string }): boolean {
  return moment(times.endTime).isAfter(moment(times.startTime));
}