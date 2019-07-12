const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

function search(searchTerm) {
    return knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(res => console.log(res));
}

//search('fish');

function paginate(pageNumber) {
    const limit = 6;
    const offset = limit * (pageNumber - 1)
    return knexInstance
            .select('*')
            .from('shopping_list')
            .limit(limit)
            .offset(offset)
            .then(res => console.log(res));
}

//paginate(3);

function daysAfter(daysAgo) {
    return knexInstance
            .select('*')
            .from('shopping_list')
            .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
            .then(res => console.log(res));
}

//daysAfter(5);

function totalCost() {
    return knexInstance
            .select('category')
            .sum('price')
            .from('shopping_list')
            .groupBy('category')
            .then(res => console.log(res));
}

totalCost();