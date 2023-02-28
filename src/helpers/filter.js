exports.filter = (data) => {
  let searchKeyword = data?.searchKeyword || "";
  let whereFilter = null;
  let limit = data?.limit || 10;
  let page = data?.page || 1;

  let test = data?.orderByString?.split("/");
  console.log(
    "data?.order",
    data?.orderByString,
    test,
    "data?.order",
    data?.orderBy
  );

  let order = data?.order
    ? data?.order
    : data?.orderByString === "bill_no"
    ? "DESC"
    : "ASC";

  let orderBy = data?.orderBy;
  let offset = 0;
  if (page > 1) {
    offset = (page - 1) * limit;
  }
  if (data?.searchKeyword) {
    offset = 0;
  }
  let paging = " limit " + limit + " offset " + offset;

  whereFilter = "  LIKE '%" + searchKeyword + "%' ";

  if (data?.order != "") {
    order = data?.order || "ASC";
  }
  if (test && test.length) {
    order = test[0] || "ASC";
  }

  if (data?.orderBy != "") {
    orderBy = data?.orderBy;
  }
  let orderByString = test && test.length ? test[1] : null;
  if (data?.orderByString === "bill_no " || data?.orderByString === "sr_no") {
    order = "DESC";
  }

  // let SQL =
  //   "SELECT * from table where " +
  //   whereFilter +
  //   " and delete_flag = 0 " +
  //   orderString +
  //   paging;

  return {
    whereFilter,
    orderByString,
    order,
    paging,
  };
};
