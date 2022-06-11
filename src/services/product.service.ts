import { query } from '../config/postgres'
import Products from '../types/products'

class ProductService {
  static async find() {
    let text = `SELECT * FROM products`

    const result = await query(text)
    return result.rows
  }

  static async findByCategoryId(data: { category_id: string }) {
    const { category_id } = data

    const text = `SELECT * FROM products WHERE category_id = $1`
    const values = [category_id]

    const result = await query(text, values)
    return result.rows
  }

  static async findOne(data: { id: string }) {
    const { id } = data

    const text = `SELECT * FROM products WHERE id = $1`
    const values = [id]

    const result = await query(text, values)
    return result.rows[0]
  }

  static async create(data: Products) {
    const { name, description, category_id, price, stock, image } = data

    const text = `
    INSERT INTO products (name, description, category_id, price, stock, image)
      VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `
    const values = [name, description, category_id, price, stock, image]
    const result = await query(text, values)
    return result.rows[0]
  }

  static async update(data: Products) {
    const { name, description, category_id, price, stock, image, id } = data

    const text = `
    UPDATE
      products
    SET
      name = $1
      description = $2
      category_id = $3
      price = $4
      stock = $5
      image = $6
    WHERE
      id = $7
    RETURNING *
    `
    const values = [name, description, category_id, price, stock, image, id]
    const result = await query(text)
    return result.rows[0]
  }
}

export default ProductService
