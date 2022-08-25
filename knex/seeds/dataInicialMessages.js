/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('messages').del()
  await knex('messages').insert([
    {id:1, email: "sdada@prueba.com", text: "Holaa", date: "24/8/2022 16:29:39" },
    {id:2, email: "sdada@prueba.com", text: "Como vaaa?", date: "24/8/2022 16:30:19" }
  ]);
};
