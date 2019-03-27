import { Router } from 'express'
import {
  autoSave,
  checkOut,
  checkRegistrationStatus,
} from '../../controllers/onboard'
import { validateInitialUnique, validateOnboard } from '../../helpers/validate'
import checkAddresses from '../../helpers/checkAddresses';
import { getCheckOutSchema } from '../../validators/onboard'

const routes = Router()
const options = {
  stripUnknown: {
    objects: true,
  },
  abortEarly: false,
}

routes.route('/autosave').post(checkRegistrationStatus, validateOnboard(getCheckOutSchema('optional'), options), validateInitialUnique, autoSave)
routes.route('/checkout').post(
  checkRegistrationStatus,
  checkAddresses,
  validateOnboard(getCheckOutSchema('required'), options),
  validateInitialUnique,
  checkOut,
);

export default routes
