exports.formValidation = (data) => {
  let error = {};
  let { product_name, product_type, hsn, weight } = data;
  if (!product_name) {
    error = "Product name is missing ";
  } else if (!product_type) {
    error = "Product type is missing";
  } else if (!hsn) {
    error = "HSN is missing";
  } else if (!weight) {
    error = "Weight is missing";
  }

  console.log(error);
  return error;
};
exports.TaxformValidation = (data) => {
  let error = {};
  let { tax_name, tax_rate, tax_country, isactive } = data;
  if (!tax_name) {
    error = "Tax name is missing ";
  } else if (!tax_rate) {
    error = "Tax rate is missing";
  } else if (!tax_country) {
    error = "Tax country is missing";
  } else if (!isactive) {
    error = "Isactive is missing";
  }

  return error;
};

exports.CustomersformValidation = (data) => {
  let error = {};
  let { customer_name, mobile_no, email, address } = data;
  if (!customer_name) {
    error = "Customer name is missing ";
  } else if (!mobile_no) {
    error = "mobile number is missing ";
  } else if (
    !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
      parseInt(mobile_no)
    )
  ) {
    error = "mobile number is invalid";
  } else if (!email) {
    error = "Email id is missing";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    error = "Email address is invalid";
  } else if (!address) {
    error = "Address is missing";
  }
  console.log(error);
  return error;
};

exports.CompanyformValidation = (data) => {
  let error = {};

  let {
    company_name,
    website,
    phone_no,
    mobile_no,
    company_address,
    terms_condition,
    fax_no,
    tin_gst_no,
  } = data;
  if (!company_name) {
    error = "Company name is missing ";
  } else if (!website) {
    error = "Website is missing";
  } else if (!phone_no) {
    error = "Phone no number is missing ";
  } else if (
    !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
      parseInt(phone_no)
    )
  ) {
    error = "Phone number is invalid";
  } else if (!mobile_no) {
    error = "mobile number is missing ";
  } else if (
    !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
      parseInt(mobile_no)
    )
  ) {
    error = "mobile number is invalid";
  } else if (!company_address) {
    error = "Company address is missing";
  } else if (!fax_no) {
    error = "fax no is missing";
  } else if (!terms_condition) {
    error = "terms and condition is missing";
  } else if (!tin_gst_no) {
    error = "tin gst no is missing";
  }
  console.log(error);
  return error;
};
exports.UserformValidation = (data) => {
  let error = {};

  let { name, role_id, address, email, password, mobile_no, company_id } = data;
  if (!name) {
    error = "Name is missing ";
  } else if (!role_id) {
    error = "Role is missing";
  } else if (!mobile_no) {
    error = "mobile number is missing ";
  } else if (
    !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
      parseInt(mobile_no)
    )
  ) {
    error = "mobile number is invalid";
  } else if (!address) {
    error = "Address is missing";
  } else if (!email) {
    error = "Email id is missing";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    error = "Email address is invalid";
  } else if (!password) {
    error = "Password is missing";
  } else if (!company_id) {
    error = "Company name is missing";
  }
  console.log(error);
  return error;
};
exports.BankformValidation = (data) => {
  let error = {};

  let { bank_name, balance } = data;
  if (!bank_name) {
    error = "bank name is missing ";
  } else if (!balance) {
    error = "balance is missing";
  }
  console.log(error);
  return error;
};
