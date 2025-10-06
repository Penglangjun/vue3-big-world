/**
 * 统一错误响应
 */
const sendErrorResponse = (res, error) => {
  return res.status(200).json(error)
}

/**
 * 统一成功响应
 */
const sendSuccessResponse = (res, message, data = null) => {
  const response = { code: 0, message }
  if (data) Object.assign(response, data)
  return res.status(200).json(response)
}

module.exports = {
  sendErrorResponse,
  sendSuccessResponse
}