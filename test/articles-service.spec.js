const ArticlesService = require('../src/articles-service');
const knex = require('knex');

describe.skip('Articles service object', () => {
    let db;
    let testArticles = [
        {
            id: 1,
            date_published: new Date('2019-07-13T05:40:06.480Z'),
            title: 'First test post',
            content: "Lorem ipsum denaeris targaeryien or whatever"
        },
        {
            id: 2,
            date_published: new Date('2019-07-13T05:40:06.480Z'),
            title: 'Second test post',
            content: "Lorem ipsum denaeris targaeryien or whatever"
        },
        {
            id: 3,
            date_published: new Date('2019-07-13T05:40:06.480Z'),
            title: 'Third test post',
            content: "Lorem ipsum denaeris targaeryien or whatever"
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    });
    before(() => db('blogful_articles').truncate());
    afterEach(() => db('blogful_articles').truncate());

    after(() => db.destroy());

    context(`given 'blogful_articles' has data,`, () => {
        beforeEach(() => {
            return db
                .into('blogful_articles')
                .insert(testArticles);
        });
        it(`getAllArticles() resolves all articles from the 'blogful_articles' table`, () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql(testArticles);
                })
        });
        it(`getById() resolves an article by id from the 'blogful_articles' table`, () => {
            const thirdId = 3;
            const thirdTestArticle = testArticles[thirdId - 1];
            return ArticlesService.getById(db, thirdId)
                    .then(actual => {
                        expect(actual).to.eql({
                            id: thirdId,
                            title: thirdTestArticle.title,
                            date_published: thirdTestArticle.date_published,
                            content: thirdTestArticle.content
                        })
                    })
        });
        it(`deleteArticle() removes an article by id from the 'blogful_articles' table`, () => {
            const articleId = 3;
            return ArticlesService.deleteArticle(db, articleId)
                    .then(() => ArticlesService.getAllArticles(db))
                    .then(allArticles => {
                        const expected = testArticles.filter(article => article.id !== articleId);
                        expect(allArticles).to.eql(expected);
                    })
        });
        it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
            const idOfArticleToUpdate = 3;
            const newArticleData = {
                title: 'updated title',
                content: 'updated content',
                date_published: new Date()
            }
            return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
                .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
                .then(article => {
                    expect(article).to.eql({
                        id: idOfArticleToUpdate,
                        ...newArticleData
                    })
                })
        })
    })

    context(`given 'blogful_articles' has no data, `, () => {
        it(`getAllArticles() resolves an empty array`, () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => 
                    expect(actual).to.eql([]))
        });
        it(`insertArcile() creates a new article and resolves it with a newly generated 'id'`, () => {
            const newArticle = {
                title: 'test article',
                date_published: new Date('2020-01-01T00:00:00.000Z'),
                content: 'woohoo! i am a test article!'
            }
            return ArticlesService.insertArticle(db, newArticle)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        title: newArticle.title,
                        date_published: newArticle.date_published,
                        content: newArticle.content
                    })
                });
        })
    })
})