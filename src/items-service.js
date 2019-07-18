const ItemsService = {
    getAllItems(knex) {
        return knex.select('*').from('shopping_list');
    },
    insertItem(knex, item) {
        return knex
                .insert(item)
                .into('shopping_list')
                .returning('*')
                .then(rows => {
                    return rows[0]
                })
    },
    getById(knex, id) {
        return knex.select('*').from('shopping_list').where('id', id).first();
    },
    deleteItem(knex, id) {
        return knex('shopping_list').where({ id }).delete();
    },
    updateItem(knex, id, content) {
        return knex('shopping_list').where({ id }).update(content);
    }
};

module.exports = ItemsService;