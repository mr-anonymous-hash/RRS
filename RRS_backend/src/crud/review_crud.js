const {Review} = require('./../models')

const getReviewById = async (id) => {
    try {
        const review = await Review.findById(id)
        return review
    } catch (error) {
        console.log(`error while fetching review by id: ${error.message}`)
    }
}

const getReviewByHotelId = async (id) => {
    try {
        const review = await Review.findById(id)
        return review
    } catch (error) {
        console.log(`error while fetching review by hotel id: ${error.message}`)
    }
}

const createReview = async (review) => {
    try {
        const newReview = await Review.create(review)
        return newReview
    } catch (error) {
        console.log(`error while creating review: ${error.message}`)
    }
}

module.exports = {
    getReviewById,getReviewByHotelId,createReview
}