const ItemsService = require('../src/items-service')
const knex = require('knex');


describe('Items service object', () => {
    let db;
    let testItems = [
        {
            id: 1,
            checked: false,
            date_added: new Date('2019-07-18T01:59:50.359Z'),
            name: 'apples',
            price: '15.00',
            category: 'Snack'
        },
        {
            id: 2,
            checked: false,
            date_added: new Date('2019-07-18T01:59:50.359Z'),
            name: 'spaghetti',
            price: '3.00',
            category: 'Main'
        },
        {
            id: 3,
            checked: false,
            date_added: new Date('2019-07-18T01:59:50.359Z'),
            name: 'cereal',
            price: '11.00',
            category: 'Breakfast'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    });
    before(() => db('shopping_list').truncate());
    afterEach(() => db('shopping_list').truncate());
    after(() => db.destroy());

    context(`given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                    .into('shopping_list')
                    .insert(testItems)
        });
        it(`getAllItems() resolves all items from the 'shopping_list' table`, () => {
            return ItemsService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems);
                })
        });
        it(`getById() resolves an article by id from the 'shopping_list' table`, () => {
            const thirdId = 3;
            const thirdTestItem = testItems[thirdId - 1];
            return ItemsService.getById(db, thirdId)
                    .then(actual => {
                        expect(actual).to.eql({
                            id: thirdId,
                            checked: thirdTestItem.checked,
                            date_added: thirdTestItem.date_added,
                            name: thirdTestItem.name,
                            price: thirdTestItem.price,
                            category: thirdTestItem.category
                        })
                    })
        });
        it(`deleteItem() removes an article by name from the 'shopping_list' table`, () => {
            const itemId = 3;
            return ItemsService.deleteItem(db, itemId)
                    .then(() => ItemsService.getAllItems(db))
                    .then(allItems => {
                        const expected = testItems.filter(item => item.id !== itemId);
                        expect(allItems).to.eql(expected);
                    })
        });
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3;
            const newItemData = {
                checked: true,
                name: 'cereal',
                date_added: new Date(),
                price: '4.20',
                category: "Breakfast"
            }
            return ItemsService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ItemsService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData
                    })
                })
        })
    })

    context(`given 'shopping_list' has no data`, () => {
        it(`getAllItems returns an empty array`, () => {
            return ItemsService.getAllItems(db)
                    .then(actual => {
                        expect(actual).to.eql([])
                    })
        })
        it(`insertItem() inserts an item into the 'shopping_list' table and receives a new id`, () => {
            const newItem = {
                checked: false,
                date_added: new Date('2019-07-18T01:59:50.359Z'),
                name: 'poop',
                price: "420.00",
                category: "Breakfast"
            }
            return ItemsService.insertItem(db, newItem)
                    .then(actual => {
                        expect(actual).to.eql({
                            id: 1,
                            checked: newItem.checked,
                            date_added: newItem.date_added,
                            name: newItem.name,
                            price: newItem.price,
                            category: newItem.category
                        })
                    })
        })
    })
})