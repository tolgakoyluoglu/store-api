function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function typeOf(input: any): string {
  let type = typeof input

  if (Array.isArray(input)) {
    type = 'array' as any
  }

  return type
}

function nestCategories(categories: any, parentId = null) {
  return categories.reduce((result: any, category: any) => {
    if (category.parent_id == parentId) {
      const obj = { ...category }
      const children = nestCategories(categories, category.id)
      if (children.length) obj.children = children
      result.push(obj)
    }

    return result
  }, [])
}

export { uuidv4, typeOf, nestCategories }
