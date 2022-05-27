import { query } from '../config/postgres'
import Category from '../types/category'

class CategoryService {
  /*
   ** Find all category
   */
  static async find() {
    const text = `
    WITH RECURSIVE query AS (
      SELECT 
        id, 
        name, 
        parent_id 
      FROM 
        categories 
      UNION ALL 
      SELECT 
        s2.id, 
        s2.name, 
        s2.parent_id 
      FROM 
        categories s2 
        JOIN query ON query.id = s2.parent_id
    ) 
    SELECT 
      DISTINCT * 
    FROM 
      query 
    ORDER BY 
      parent_id
    `
    const result = await query(text)
    return result.rows
  }
  /*
   ** Find one category
   */
  static async findOne(data: { id?: string; name?: string }) {
    const { id, name } = data
    const text = `SELECT * FROM categories WHERE id = $1 OR name = $2`
    const values = [id, name]

    const result = await query(text, values)
    return result.rows[0]
  }
  /*
   ** Create category
   */
  static async create(data: Category) {
    let { name, parent_id } = data
    if (!parent_id) parent_id = null

    const text = `
    INSERT INTO categories (name, parent_id) 
    VALUES 
      ($1, $2) RETURNING id, 
      name, 
      parent_id
    `
    const values = [name, parent_id]

    const result = await query(text, values)
    return result.rows[0]
  }
  /*
   ** Update category
   */
  static async update(data: { id: string; name: string; parent_id: string }) {
    const { id, name, parent_id } = data
    const text = `
    UPDATE
      customers
    SET
      name = $1
      parent_id = $2
    WHERE
      id = $3
    RETURNING id, name, parent_id
    `
    const values = [name, parent_id, id]
    const result = await query(text, values)

    return result.rows[0]
  }
}

export default CategoryService
