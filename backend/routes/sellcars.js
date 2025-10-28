const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAll, create, update, remove } = require('../controllers/sellController');

router.get('/', auth, getAll);       // admin list
router.post('/', create);            // public submit
router.put('/:id', auth, update);    // approve/reject
router.delete('/:id', auth, remove);

module.exports = router;
