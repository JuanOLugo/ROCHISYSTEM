const { connect } = require("mongoose");

const start_db = (uri) => {
  try {
    //Start connection MONGODB
    connect(uri);
    console.log("DB IS START");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = start_db
