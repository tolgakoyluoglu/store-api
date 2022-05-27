interface Category {
  id?: string
  name: string
  parent_id: string | null
  description?: string
  image?: string
}

export default Category
