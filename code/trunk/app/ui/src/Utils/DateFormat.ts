import moment from "moment";

export function ledgerDateFromDate(date: Date) {
  return date.toISOString();
}

export function newLedgerDate() {
  return new Date().toISOString();
}

export function ledgerDate(dateStr: string) {
  return new Date(dateStr).toISOString();
}

export function uiDate(dateStr: string) {
  return moment(dateStr).format('DD/MM/YYYY HH:mm')
}

export function uiSplitDate(dateStr: string) {
  return moment(dateStr).format('DD/MM/YYYY HH:mm').split(" ");
}

export function newEditDate() {
  return moment(new Date()).format("YYYY-MM-DDTHH:mm");
}

export function startOfTime() {
  return moment(new Date(0)).format("YYYY-MM-DDTHH:mm");
}
