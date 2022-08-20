const express = require('express');
const { getCourses, getCourse, addCourse } = require('../controllers/courses');

// Because we are merging the URL params for courses by bootcamp
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse);

module.exports = router;
