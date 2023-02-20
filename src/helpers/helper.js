const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};
exports.formatDate = (date) => {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
};
// exports.convert = (dates) => {
//   var date = new Date(dates),
//     mnth = ("0" + (date.getMonth() + 1)).slice(-2),
//     day = ("0" + date.getDate()).slice(-2);
//   return [day, mnth, date.getFullYear()].join("-");
// };
