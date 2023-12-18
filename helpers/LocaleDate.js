const LocaleDate = () => {
  const currentDate = new Date();
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("uk-UA", options);
  return formattedDate;
};

module.exports = LocaleDate;
