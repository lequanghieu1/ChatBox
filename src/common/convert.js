import moment from "moment";
export const convertObject = object => {
  return Object.entries(object || {}).map(([key, value]) => {
    return value;
  });
};
export const formatDay = (day, type) => {
  return moment(day).format(type);
};
export const formatCurrency = price => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ" || "";
};
export const numberOnly = (value) => {
  return value.replace(/[^0-9]/gi, "");
}
