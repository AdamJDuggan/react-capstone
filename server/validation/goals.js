const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateGoalsInput(data) {
  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ''
  data.started = !isEmpty(data.started) ? data.started : ''
  data.deadline = !isEmpty(data.deadline) ? data.deadline : ''


  if (Validator.isEmpty(data.title)) {
    errors.title = 'A goal needs a title!'
  }

  if (Validator.isEmpty(data.started)) {
    errors.started = 'Every goal needs a start date!'
  }

  if (Validator.isEmpty(data.deadline)) {
    errors.deadline = 'Every goal needs a deadline or it probably wont happen!'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}