const router = require('express').Router();
const auth = require('../middleware/auth');
const { getCars, getCarById, addCar, updateCar, deleteCar } = require('../controllers/carController');

router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', auth, addCar);
router.put('/:id', auth, updateCar);
router.delete('/:id', auth, deleteCar);

module.exports = router;
