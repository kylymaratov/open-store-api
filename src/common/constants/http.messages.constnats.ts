export const httpErrorMessages = {
  NO_INFORMATION: 'No information available',
  NO_PRIVILEGES: 'Insufficient privileges',
  NOT_FOUND: (msg: string) => `${msg} not found`,
  INVALID_CREDENTIALS: 'Invalid email or password',
  ONLY_IMAGE_ALLOWED: (msg: string) => `Only image files are allowed ${msg}`,
  NO_CONTENT: (msg: string) => `Content not found in ${msg}`,
  ALREADY_EXISTS: (msg: string) => `${msg} already exists`,
  INVALID_INPUT_DATA: 'Invalid input data. Please check and try again',
  SOME_PRODUCT_NOT_FOUND: 'Some products not found or out of stock',
  DISCOUNT_PRICE_CANNOT_BE_BIGGER:
    'Discounted price cannot be bigger then price',
  IMAGE_FIELD_IS_EMPTY: 'Image field is empty',
  BAD_REQUEST: 'Bad request',
  SERVER_ERROR: 'Internal server error',
}

export const httpSuccessMessages = {
  CREATED: (msg: string) => `${msg} successfilly created`,
  UPDATED: (msg: string) => `${msg} successfilly updated`,
  SUCCESS: (msg: string) => `${msg} request successfilly finished`,
  UPLOADED: (msg: string) => `${msg} successfilly uploaded`,
  SUCCESS_LOGGED: 'You successfilly logged in',
  SUCCESS_LOGOUT: 'You successfilly logout',
  DELETED: (msg: string) => `${msg} successfilly deleted`,
}
