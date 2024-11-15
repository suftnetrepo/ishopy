const loginValidator = {
  rules: {
    email: [
      {
        pattern: /^[\w-.]+(?:\.[\w-]+)*@([\w-]+\.)+[\w-]{2,4}$/,
        message: "Please enter a valid email address",
      },
    ]   
  },
  fields: {
    email: ""  
  },
};

export  {
  loginValidator
}
