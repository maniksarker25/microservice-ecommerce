const generateCode = () => {
  const timestamp = new Date().getTime().toString();

  const randomNum = Math.floor(10 + Math.random() * 90);
  let code = (timestamp + randomNum).slice(-5);

  return code;
};

export default generateCode;
