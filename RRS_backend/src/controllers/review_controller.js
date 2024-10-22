const review_crud = require('./../crud/review_crud')

const getReviewById = async(req, res) => {
    try {
        const review = await review_crud.getReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getReviewByHotelId = async(req, res) => {
    try {
        const review = await review_crud.getReviewByHotelId(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const createReview = async(req, res) => {

    const {rating,comment,hotelId,userId} = req.body
    const data = {rating,comment,hotelId,userId}

    try {
        const newReview = await review_crud.createReview(data);
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    getReviewById,getReviewByHotelId,createReview
}