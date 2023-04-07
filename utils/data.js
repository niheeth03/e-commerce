import bcrypt from 'bcryptjs';

const data={
    users: [
        {
          name: 'John',
          email: 'admin@example.com',
          password: bcrypt.hashSync('123456'),
          isAdmin: true,
        },
        {
          name: 'Jane',
          email: 'user@example.com',
          password: bcrypt.hashSync('123456'),
          isAdmin: false,
        },
      ],
    products:
    [
        {
            name:'Free Shirt',
            slug:'free-shirt',
            category:'Shirts',
            price:70,
            brand:'Nike',
            rating:4.5,
            numReviews:8,
            countInStock:20,
            description:'A popular shirt'
        },
        {
            name:'Slim Shirt',
            slug:'free-shirt',
            category:'Shirts',
            price:70,
            brand:'Nike',
            rating:4.5,
            numReviews:8,
            countInStock:20,
            description:'A popular shirt',
            isFeatured: true,
            banner: '/images/banner1.jpg',
        },
        {
            name:'Slim Pant',
            slug:'free-shirt',
            category:'Pants',
            price:70,
            brand:'Nike',
            rating:4.5,
            numReviews:8,
            countInStock:20,
            description:'A popular shirt',
            isFeatured: true,
            banner: '/images/banner2.jpg',
        }
    ]
}

export default data;