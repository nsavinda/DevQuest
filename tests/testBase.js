import session from "supertest-session";
process.env.NODE_ENV = "test";

function authenticateTestSession(testSession) {
  var username = "rhoward@office.com";
  var pwd = "Ryan@1234";
  var userId = 6;

  return new Promise((resolve, reject) => {
    testSession
      .post("/api/auth/login")
      .send({ email: username, password: pwd })
      .expect(200)
      .end(function (err) {
        if (err) reject(err);
        resolve(userId);
      });
  });
}

function resetDatabase(_db) {
  return new Promise(async (resolve, reject) => {
    try {
      await _db.migrate.latest().then(async () => await _db.seed.run());
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function createSuperTestSession(app) {
  return session(app);
}

function assertErrorPage(document) {
  expect(document.title).not.toBe("Error Page");
}

export default {
  authenticateTestSession,
  resetDatabase,
  createSuperTestSession,
  assertErrorPage,
};
