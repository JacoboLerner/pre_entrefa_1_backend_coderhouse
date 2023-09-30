import { faker } from '@faker-js/faker'

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        _id: faker.database.mongodbObjectId(),
        status: true,
        price: parseFloat(faker.commerce.price()),
        stock: parseInt(faker.number.int({ min: 20, max: 100 })),
        category: faker.commerce.department(),
        thumbnail: [faker.image.url()],
    };
};