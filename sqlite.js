import sqlite3 from "sqlite3";

let _DBConnection;

const connectDatabase = async () => {
  if (process.env.NODE_ENV === "test") {
    return new sqlite3.Database(":memory:", sqlite3.verbose().OPEN_READWRITE);
  } else {
    return new sqlite3.Database(
      "./main.sqlite3",
      sqlite3.verbose().OPEN_READWRITE
    );
  }
};

const getDbConnection = async () => {
  if (!_DBConnection) {
    _DBConnection = await connectDatabase();
  }
  return _DBConnection;
};

const closeConnection = (conn) => {
  if (conn) {
    return conn.close();
  }
};

export default {
  getDbConnection,
  closeConnection,
};
