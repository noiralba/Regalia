const db = require("../db");

async function getAllPersons(targetDb = db) {
  const [persons] = await targetDb.query(
    "SELECT id, name, bio, image FROM persons ORDER BY name ASC",
  );
  return persons;
}

async function getPersonById(id, targetDb = db) {
  const [persons] = await targetDb.query(
    "SELECT id, name, bio, image FROM persons WHERE id = ?",
    [id],
  );
  return persons[0] || null;
}

async function createPerson(personData, targetDb = db) {
  await targetDb.query("INSERT INTO persons SET ?", personData);
  return personData;
}

async function updatePerson(id, updateData, targetDb = db) {
  await targetDb.query("UPDATE persons SET ? WHERE id = ?", [updateData, id]);
  return { id, ...updateData };
}

async function deletePerson(id, targetDb = db) {
  const [result] = await targetDb.query("DELETE FROM persons WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
};
