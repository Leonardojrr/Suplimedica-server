const { Client } = require("pg");

class database {
  constructor() {
    this.client = null;
  }

  async conn() {
    this.client = new Client({
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE,
    });
    await this.client.connect();
  }

  async execute(query, values) {
    try {
      let res = await this.client.query(query, values);
      return res;
    } catch (err) {
      return err;
    }
  }

  async close() {
    await this.client.end();
  }
}

module.exports = database;
