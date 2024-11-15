const otpValidator = {
  rules: {
    t1: [
      {
        pattern: /^(?=.{1,})[0-9]$/,
        message: "Please enter a valid number",
      },
    ],
    t2: [
      {
        pattern: /^(?=.{1,})[0-9]$/,
        message: "Please enter a valid number",
      },
    ],
    t3: [
      {
        pattern: /^(?=.{1,})[0-9]$/,
        message: "Please enter a valid number",
      },
    ],
    t4: [
      {
        pattern: /^(?=.{1,})[0-9]$/,
        message: "Please enter a valid number",
      },
    ],
    t5: [
      {
        pattern: /^(?=.{1,})[0-9]$/,
        message: "Please enter a valid number",
      },
    ],
    t6: [
      {
        pattern: /^(?=.{1,})[0-9]$/,
        message: "Please enter a valid number",
      },
    ]   
  },
  fields: {
    t1: "",
    t2: "",
    t3: "",
    t4: "",
    t5: "",
    t6: "", 
  },
  otpCode: (email, fields) => {
    const values = Object.values(fields);       
    return {
      otp: values.join(""),
      email:  email
    };
  },
};

export { otpValidator };
