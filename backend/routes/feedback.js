const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAll, create, remove } = require('../controllers/feedbackController');

router.get('/', getAll);
router.post('/', create);
router.delete('/:id', auth, remove);

module.exports = router;
