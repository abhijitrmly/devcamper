const express = require('express');
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');

const Course = require('../models/Course');
const advancedResult = require('../middleware/advancedResults');
const advancedResults = require('../middleware/advancedResults');

// Because we are merging the URL params for courses by bootcamp
const router = express.Router({ mergeParams: true });

router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
