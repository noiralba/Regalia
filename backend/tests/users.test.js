const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { runInNewContext } = require("node:vm");

function setup() {
  const routes = {};
  const calls = [];
  let result = { affectedRows: 1 };

  const fakeRouter = {
    use() {}, // Vi har redan testat 403-spärren i Thunder Client
  };

  for (const method of ["post", "get", "patch", "delete"]) {
    fakeRouter[method] = (_, handler) => {
      routes[method.toUpperCase()] = handler;
    };
  }

  const fakeDb = {
    execute: async (sql, values) => {
      calls.push({ sql, values });
      return [result];
    },
  };

  const dependencies = {
    express: { Router: () => fakeRouter },
    "../db": fakeDb,
    bcrypt: { hash: async () => "test-hash" },
    "node:crypto": { randomUUID: () => "test-user-id" },
  };

  const source = readFileSync(join(__dirname, "../routes/users.js"), "utf8");

  runInNewContext(source, {
    require: (name) => {
      if (!(name in dependencies)) {
        throw Error(`Okänt beroende: ${name}`);
      }
      return dependencies[name];
    },
    module: { exports: {} },
    Buffer,
    console,
  });

  return {
    routes,
    calls,
    setResult: (value) => {
      result = value;
    },
  };
}

function response() {
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
    send() {
      return this;
    },
  };
}

test("POST: skapar användare utan att returnera lösenord", async () => {
  const { routes, calls } = setup();
  const res = response();

  await routes.POST(
    {
      body: {
        first_name: "Anna",
        last_name: "Andersson",
        email: "ANNA@example.com",
        password: "hemligt-losenord",
      },
    },
    res,
  );

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.email, "anna@example.com");
  assert.equal(res.body.password, undefined);
  assert.match(calls[0].sql, /INSERT INTO users/);
  assert.equal(calls[0].values[4], "test-hash");
});

test("POST: saknat fält ger 400", async () => {
  const { routes, calls } = setup();
  const res = response();

  await routes.POST({ body: { first_name: "Anna" } }, res);

  assert.equal(res.statusCode, 400);
  assert.equal(calls.length, 0);
});

test("GET: hämtar användare utan lösenord", async () => {
  const { routes, setResult, calls } = setup();

  setResult([
    {
      id: "u1",
      first_name: "Anna",
      last_name: "Andersson",
      email: "anna@example.com",
    },
  ]);

  const res = response();

  await routes.GET({ params: { id: "u1" } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.id, "u1");
  assert.doesNotMatch(calls[0].sql, /SELECT \*/i);
});

test("GET: okänt ID ger 404", async () => {
  const { routes, setResult } = setup();
  setResult([]);

  const res = response();

  await routes.GET({ params: { id: "saknas" } }, res);

  assert.equal(res.statusCode, 404);
});

test("PATCH: uppdaterar tillåtet fält", async () => {
  const { routes, calls } = setup();
  const res = response();

  await routes.PATCH(
    {
      params: { id: "u1" },
      body: { first_name: "Eva" },
    },
    res,
  );

  assert.equal(res.statusCode, 200);
  assert.match(calls[0].sql, /UPDATE users SET/);
  assert.equal(calls[0].values[0], "Eva");
  assert.equal(calls[0].values[1], "u1");
});

test("PATCH: tillåter inte lösenordsändring", async () => {
  const { routes, calls } = setup();
  const res = response();

  await routes.PATCH(
    {
      params: { id: "u1" },
      body: { password: "nytt" },
    },
    res,
  );

  assert.equal(res.statusCode, 400);
  assert.equal(calls.length, 0);
});

test("DELETE: tar bort användare via ID", async () => {
  const { routes, calls } = setup();
  const res = response();

  await routes.DELETE({ params: { id: "u1" } }, res);

  assert.equal(res.statusCode, 204);
  assert.match(calls[0].sql, /DELETE FROM users WHERE id = \?/);
  assert.equal(calls[0].values[0], "u1");
});

test("DELETE: okänt ID ger 404", async () => {
  const { routes, setResult } = setup();
  setResult({ affectedRows: 0 });

  const res = response();

  await routes.DELETE({ params: { id: "saknas" } }, res);

  assert.equal(res.statusCode, 404);
});
