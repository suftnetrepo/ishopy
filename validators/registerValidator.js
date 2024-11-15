
const registerValidator = {
  register: {
    first_name: [
      { pattern: /^.+$/,
       message: 'first name is required' },
      {
        pattern: /^.{0,50}$/,
        message: 'first name must be no more than 50 characters',
      },
    ],
    last_name: [
      { pattern: /^.+$/, message: 'last name is required' },
      {
        pattern: /^.{0,50}$/,
        message: 'last name must be no more than 50 characters',
      },
    ],   
    email: [
      { pattern: /.+/, message: 'email address is required' },
      {
        pattern: /^[\w-.]+(?:\.[\w-]+)*@([\w-]+\.)+[\w-]{2,4}$/,
        message: 'Please enter a valid email address',
      },
      {
        pattern: /^.{0,50}$/,
        message: 'email address must be no more than 50 characters',
      },
    ],  
  },
  fields: {
    firstname: "",
    lastname: "",
    email: "",     
    mobile: "",   
    company: "",   
    type: "Buyer", 
    fcm_token: "", 
  },
};

export  {
  registerValidator
}
