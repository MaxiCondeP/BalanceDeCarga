/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  await knex('products').insert([
    {
      title: "Teclado",
      price: 2500,
      thumbnail: "https://cdn4.iconfinder.com/data/icons/web-essential-4/64/31-web_essential-128.png"
    },
    {
      title: "Mouse",
      price: 1000,
      thumbnail: "https://cdn3.iconfinder.com/data/icons/computer-51/100/computer_10-128.png"
    },
    {
      title: "Monitor",
      price: 10000,
      thumbnail: "https://cdn4.iconfinder.com/data/icons/multimedia-75/512/multimedia-37-128.png"
    }
  ]);
};