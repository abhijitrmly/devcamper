const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title'],
    },
    description: {
        type: String,
        required: [true, 'Please add description'],
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks'],
    },
    tuition: {
        type: Number,
        required: [true, 'Please add tuition cost'],
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: true,
    }
});

// Static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {
    const obj = await this.aggregate([{
        $match: {
            bootcamp: bootcampId
        }
    }, {
        $group: {
            _id: '$bootcamp',
            averageCost: { $avg: '$tuition' }
        }
    }]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost /10)*10
        });
    } catch(err) {
        console.error(err);
    }
}

// Call getAverageCost after save
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
})

// Call getAverageCost before remove
CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp);
})

module.exports = mongoose.model('Course', CourseSchema);