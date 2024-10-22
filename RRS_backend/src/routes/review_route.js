const router = require('express').Route()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/:id',review_controller.getReviewById)
