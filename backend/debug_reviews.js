const { sequelize } = require('./src/config/database');
const Review = require('./src/models/mysql/Review');

(async () => {
  try {
    const reviews = await Review.findAll({
      limit: 5,
      order: [['created_at', 'DESC']]
    });
    console.log(JSON.stringify(reviews, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
})();
