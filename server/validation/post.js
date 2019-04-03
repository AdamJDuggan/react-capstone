const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validatePostInput(data) {
  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ''
  data.description = !isEmpty(data.description ) ? data.description  : ''
  data.text = !isEmpty(data.text) ? data.text : ''

  if (!Validator.isLength(data.title, {min: 2, max: 40})) {
    errors.title = 'You workout title needs to be between 2 and 40 characters!'
  }

  if (!Validator.isLength(data.description , {min: 10, max: 400})) {
    errors.title = 'You workout description needs to be between 10 and 400 characters!'
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = 'A workout post need a title!'
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'A comment needs some words!'
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Hey, give a description of your workout so we can do it! '
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}