import { query } from '../config/postgres'
import bcrypt from 'bcryptjs'

class CustomerService {
  /*
   ** Find one customer
   */
  static async findOne(data: { email?: string; id?: string }) {
    const { email, id } = data
    const text = `SELECT * FROM customers WHERE email = $1 OR id= $2`
    const values = [email, id]

    const result = await query(text, values)
    return result.rows[0]
  }
  /*
   ** Create customer
   */
  static async create(data: { email: string; password?: string }) {
    const { email, password } = data
    const text = `
    INSERT INTO customers (email, password)
      VALUES ($1, $2)
    RETURNING id, email
    `
    const values = [email, password]

    const result = await query(text, values)
    return result.rows[0]
  }
  /*
   ** Update customer
   */
  static async update(data: { id: string; sessions: string[] }) {
    const { id, sessions } = data
    const text = `
    UPDATE
      customers
    SET
      sessions = $2
    WHERE
      id = $1
    RETURNING id, email
    `
    const values = [id, sessions]
    const result = await query(text, values)
    return result.rows[0]
  }

  static async comparePassword(customerPassword: string, password: string) {
    return bcrypt.compareSync(password, customerPassword)
  }
}

export default CustomerService
