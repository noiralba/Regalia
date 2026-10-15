const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

const requireAuth = require("../middleware/requireAuth");
const requireOwnUser = require("../middleware/requireOwnUser");

// Använd en separat testnyckel, aldrig projektets riktiga hemlighet.
const previousSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = "only-for-regalia-automated-tests";

after(() => {
  if (previousSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = previousSecret;
  }
});

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

function createToken(payload = { sub: "test-user-id" }, expiresIn = "1h") {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    issuer: "regalia",
    audience: "regalia-api",
    expiresIn,
  });
}

test("requireAuth: saknad token ger 401", () => {
  const req = { get: () => undefined };
  const res = createResponse();
  let nextCalled = false;

  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("requireAuth: ogiltig token ger 401", () => {
  const req = { get: () => "Bearer ogiltig-token" };
  const res = createResponse();
  let nextCalled = false;

  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("requireAuth: giltig token släpper igenom rätt användare", () => {
  const token = createToken();
  const req = { get: () => `Bearer ${token}` };
  const res = createResponse();
  let nextCalled = false;

  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.id, "test-user-id");
});

test("requireAuth: utgången token ger 401", () => {
  const token = createToken({ sub: "test-user-id" }, -1);
  const req = { get: () => `Bearer ${token}` };
  const res = createResponse();
  let nextCalled = false;

  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("requireAuth: token utan användar-ID ger 401", () => {
  const token = createToken({ other: "value" });
  const req = { get: () => `Bearer ${token}` };
  const res = createResponse();
  let nextCalled = false;

  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("requireOwnUser: ej inloggad ger 401", () => {
  const req = { params: { id: "test-user-id" } };
  const res = createResponse();
  let nextCalled = false;

  requireOwnUser(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("requireOwnUser: annat användar-ID ger 403", () => {
  const req = {
    user: { id: "test-user-id" },
    params: { id: "annan-användare" },
  };
  const res = createResponse();
  let nextCalled = false;

  requireOwnUser(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test("requireOwnUser: eget användar-ID släpps igenom", () => {
  const req = {
    user: { id: "test-user-id" },
    params: { id: "test-user-id" },
  };
  const res = createResponse();
  let nextCalled = false;

  requireOwnUser(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});
