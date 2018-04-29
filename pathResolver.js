const path = require('path')
module.exports = filePath => {
  if (process.env.LAMBDA_TASK_ROOT) {
    return path.resolve(
      process.env.LAMBDA_TASK_ROOT,
      'dist',
      process.env.AWS_LAMBDA_FUNCTION_NAME,
      filePath
    )
  } else {
    return path.resolve(filePath)
  }
}
