// import { CategoryService, ProductService } from '../../services'
// import { faker } from '@faker-js/faker'

// async function seeder() {
//   try {
//     console.log('Start migration..')
//     for (let i = 0; i < 5; i++) {
//       const name = faker.commerce.product()
//       const description = faker.commerce.productDescription()

//       await CategoryService.create({ name, description })
//     }
//     const categories = await CategoryService.find()
//     for (let i = 0; i < 20; i++) {
//       const name = faker.commerce.productName()
//       const description = faker.commerce.productDescription()
//       const price = faker.random.numeric(3)
//       const stock = faker.random.numeric(3)
//       const color = faker.color
//       const brand = faker.commerce.product()
//       const category = Math.floor(Math.random() * (5 - 0)) + 0
//       const product = {
//         name,
//         description,
//         price,
//         stock,
//         color,
//         brand,
//         category_id: categories[category].id,
//         image: 'https://propertywiselaunceston.com.au/wp-content/themes/property-wise/images/thumbnail-default@2x.png',
//       }
//       await ProductService.create(product)
//     }
//     console.log('Migration done!')
//   } catch (error) {
//     console.log(error)
//   }
// }

// export default seeder
