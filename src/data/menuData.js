export const categories = [
    { 
        id: 1, 
        name: 'Signature Coffee', 
        slug: 'signature-coffee', 
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&auto=format&fit=crop&q=70',
        subtitle: '5 Varian Espresso Khas Kiri Coffee'
    },
    { 
        id: 2, 
        name: 'Non-Coffee & Refreshers', 
        slug: 'non-coffee', 
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=70',
        subtitle: '4 Mocktail & Artisanal Latte'
    },
    { 
        id: 3, 
        name: 'Artisan Pastry', 
        slug: 'pastry-bakery', 
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=70',
        subtitle: '4 Croissant & Danish Warm Pastry'
    },
    { 
        id: 4, 
        name: 'Eatery & Mains', 
        slug: 'eatery-mains', 
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=70',
        subtitle: '4 Gourmet Burger, Salmon Soba & Mains'
    }
];

export const menus = [
    // Signature Coffee
    { 
        id: 1, 
        category_id: 1, 
        name: 'Es Kopi Kiri', 
        description: 'Signature salty-caramel espresso blend dipadu textured cream khas Kiri Coffee.', 
        price: 23000, 
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=350&auto=format&fit=crop&q=70', 
        image_ice: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=350&auto=format&fit=crop&q=70',
        image_hot: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=350&auto=format&fit=crop&q=70',
        is_beverage: true, 
        temp_options: 'both',
        is_milk_based: true,
        is_bestseller: true,
        category_slug: 'signature-coffee'
    },
    { 
        id: 2, 
        category_id: 1, 
        name: 'Es Kopi Harakiri', 
        description: 'Espresso double shot melimpah dipadu aroma pandan harum & sirup gula aren.', 
        price: 24000, 
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=350&auto=format&fit=crop&q=70', 
        image_ice: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=350&auto=format&fit=crop&q=70',
        image_hot: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=350&auto=format&fit=crop&q=70',
        is_beverage: true, 
        temp_options: 'both',
        is_milk_based: true,
        is_bestseller: true,
        category_slug: 'signature-coffee'
    },
    { 
        id: 3, 
        category_id: 1, 
        name: 'Kiri Kopi Kedua', 
        description: 'Signature mocha espresso hangat dengan sentuhan dark chocolate premium & marshmallow.', 
        price: 25000, 
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=350&auto=format&fit=crop&q=70', 
        image_ice: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=350&auto=format&fit=crop&q=70',
        image_hot: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=350&auto=format&fit=crop&q=70',
        is_beverage: true, 
        temp_options: 'hot_only',
        is_milk_based: true,
        is_bestseller: false,
        category_slug: 'signature-coffee'
    },
    { 
        id: 4, 
        category_id: 1, 
        name: 'Butterscotch Cheese Cream', 
        description: 'Smooth espresso topped dengan cream cheese gurih manis & lelehan butterscotch.', 
        price: 28000, 
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=350&auto=format&fit=crop&q=70', 
        image_ice: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=350&auto=format&fit=crop&q=70',
        image_hot: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=350&auto=format&fit=crop&q=70',
        is_beverage: true, 
        temp_options: 'both',
        is_milk_based: true,
        is_bestseller: true,
        category_slug: 'signature-coffee'
    },
    { 
        id: 5, 
        category_id: 1, 
        name: 'Spanish Latte', 
        description: 'Rich espresso shot disajikan dengan sweetened condensed milk & steamed fresh milk.', 
        price: 26000, 
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=350&auto=format&fit=crop&q=70', 
        image_ice: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=350&auto=format&fit=crop&q=70',
        image_hot: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=350&auto=format&fit=crop&q=70',
        is_beverage: true, 
        temp_options: 'both',
        is_milk_based: true,
        is_bestseller: false,
        category_slug: 'signature-coffee'
    },

    // Non-Coffee & Refreshers
    { 
        id: 6, 
        category_id: 2, 
        name: 'Caramon Mocktail', 
        description: 'Mocktail segar perpaduan citrus, butter caramel, dan fizz sparkle dingin.', 
        price: 27000, 
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=350&auto=format&fit=crop&q=70', 
        image_ice: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=350&auto=format&fit=crop&q=70',
        image_hot: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=350&auto=format&fit=crop&q=70',
        is_beverage: true, 
        temp_options: 'ice_only',
        is_milk_based: false,
        is_bestseller: true,
        category_slug: 'non-coffee'
    },
    { 
        id: 7, 
        category_id: 2, 
        name: 'Mela Fresca', 
        description: 'Fresh green apple mocktail infused dengan daun mint aromatic & jeruk nipis.', 
        price: 26000, 
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=350&auto=format&fit=crop&q=70', 
        image_ice: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=350&auto=format&fit=crop&q=70',
        image_hot: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=350&auto=format&fit=crop&q=70',
        is_beverage: true, 
        temp_options: 'ice_only',
        is_milk_based: false,
        is_bestseller: false,
        category_slug: 'non-coffee'
    },
    { 
        id: 8, 
        category_id: 2, 
        name: 'Matcha Artisanal Latte', 
        description: 'Pure Japanese Uji Matcha kelas premium dipadu steamed fresh milk velvety.', 
        price: 28000, 
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=350&auto=format&fit=crop&q=70', 
        image_ice: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=350&auto=format&fit=crop&q=70',
        image_hot: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=350&auto=format&fit=crop&q=70',
        is_beverage: true, 
        temp_options: 'both',
        is_milk_based: true,
        is_bestseller: true,
        category_slug: 'non-coffee'
    },
    { 
        id: 9, 
        category_id: 2, 
        name: 'Moonlight Berry Smoothie', 
        description: 'Mixed wild berry smoothie creamy dengan topping Greek yogurt & muesli.', 
        price: 30000, 
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=350&auto=format&fit=crop&q=70', 
        image_ice: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=350&auto=format&fit=crop&q=70',
        image_hot: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=350&auto=format&fit=crop&q=70',
        is_beverage: true, 
        temp_options: 'ice_only',
        is_milk_based: false,
        is_bestseller: false,
        category_slug: 'non-coffee'
    },

    // Artisan Pastry & Bakery
    { 
        id: 10, 
        category_id: 3, 
        name: 'Canele Vanilla Bordeaux', 
        description: 'Pastri klasik Perancis dengan kerak karamel renyah dan isian custard vanilla.', 
        price: 20000, 
        image: 'https://images.unsplash.com/photo-1621236378699-8597faf6a172?w=350&auto=format&fit=crop&q=70', 
        is_beverage: false, 
        is_milk_based: false,
        is_bestseller: true,
        category_slug: 'pastry-bakery'
    },
    { 
        id: 11, 
        category_id: 3, 
        name: 'Nutella Butter Croissant', 
        description: 'Flaky French butter croissant hangat diisi lelehan Nutella hazelnut manis.', 
        price: 26000, 
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=350&auto=format&fit=crop&q=70', 
        is_beverage: false, 
        is_milk_based: false,
        is_bestseller: true,
        category_slug: 'pastry-bakery'
    },
    { 
        id: 12, 
        category_id: 3, 
        name: 'Almond Cream Danish', 
        description: 'Pastry renyah berlapis cream almond manis bertabur roasted almond gurih.', 
        price: 27000, 
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=350&auto=format&fit=crop&q=70', 
        is_beverage: false, 
        is_milk_based: false,
        is_bestseller: false,
        category_slug: 'pastry-bakery'
    },
    { 
        id: 13, 
        category_id: 3, 
        name: 'Cinnamon Brown Sugar Roll', 
        description: 'Gulungan roti kayu manis brown sugar disajikan dengan cream cheese frosting.', 
        price: 22000, 
        image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=350&auto=format&fit=crop&q=70', 
        is_beverage: false, 
        is_milk_based: false,
        is_bestseller: false,
        category_slug: 'pastry-bakery'
    },

    // Eatery & Mains
    { 
        id: 14, 
        category_id: 4, 
        name: 'Kiri Classic Beef Burger', 
        description: 'Juicy Australian beef patty, melted cheddar cheese, caramelised onion.', 
        price: 45000, 
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=350&auto=format&fit=crop&q=70', 
        is_beverage: false, 
        is_milk_based: false,
        is_bestseller: true,
        category_slug: 'eatery-mains'
    },
    { 
        id: 15, 
        category_id: 4, 
        name: 'Sesame Salmon Soba', 
        description: 'Grilled salmon steak juicy disajikan di atas mie soba dingin saus wijen sangrai.', 
        price: 52000, 
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=350&auto=format&fit=crop&q=70', 
        is_beverage: false, 
        is_milk_based: false,
        is_bestseller: true,
        category_slug: 'eatery-mains'
    },
    { 
        id: 16, 
        category_id: 4, 
        name: 'Truffle Mushroom Fries', 
        description: 'Kentang goreng renyah dengan aroma truffle oil, parmesan & dip garlic mayo.', 
        price: 28000, 
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=350&auto=format&fit=crop&q=70', 
        is_beverage: false, 
        is_milk_based: false,
        is_bestseller: false,
        category_slug: 'eatery-mains'
    },
    { 
        id: 17, 
        category_id: 4, 
        name: 'Spaghetti Creamy Bolognese', 
        description: 'Pasta al dente dalam saus minced beef bolognese lembut dengan cream cheese.', 
        price: 38000, 
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=350&auto=format&fit=crop&q=70', 
        is_beverage: false, 
        is_milk_based: false,
        is_bestseller: false,
        category_slug: 'eatery-mains'
    }
];

export function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}
