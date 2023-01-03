const router = require('express').Router()
const SportController = require('../controllers/SportController')

// middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/newactivity', verifyToken, imageUpload.single("image"),SportController.createNewActivity)
router.get('/', SportController.getAll)
router.get('/myactivities', verifyToken, SportController.getMyActivities)

module.exports = router;
