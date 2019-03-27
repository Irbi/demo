import success from '../helpers/success'
import { sendSetPasswordEmail } from '../helpers/mail'
import userProvider from '../providers/user'
import UserProvider from '../providers/user'
import { HttpLockedError } from '../helpers/errors'
import investorProvider from '../providers/investor'
import sessionProvider from '../providers/session'
import orderProvider from '../providers/order'
import { syncOnfidoData, syncOnfidoFile } from '../helpers/syncOnfido'
import { runCheckoutValidation } from '../helpers/validateCheckout'
import userActionProvider from '../providers/user-action'
import { omnisendSilentContact } from '../helpers/omnisend'
import logger from '../helpers/logger'
import { PAYMENT_TYPE_ETH } from '../constants';
export const checkRegistrationStatus = async (req, res, next) => {
  try {
    const isFreezed = await userProvider.isFreezed(req.user)
    if (isFreezed) {
      return next(new HttpLockedError('Registration completed, unable to modify user'))
    }
    next()

  } catch (e) {
    logger.error(e)
    next(e)
  }
}

export const autoSave = async (req, res, next) => {
  try {
    const investorsExisted = await investorProvider.byParentId(req.user)
    const user = await userProvider.saveOnBoardRequest(req.body, req.user)

    await syncOnfidoData(user, investorsExisted)
    // syncOnfidoDataAsync(user, investorsExisted)

    const isRegistrationEmailSent = user && user.emails && user.emails.registration
    omnisendSilentContact(user)
    if (!isRegistrationEmailSent) {
      const action = await userActionProvider.generateSetPersonalPasswordActionRecord(user._id)

      await sendSetPasswordEmail(user, action)

      await UserProvider.updateSentEmail(user._id, 'registration')
    }

    let order = await orderProvider.getOrderOrCreate(user._id);

    if (req.body.paymentSubType !== undefined) {
       order.set({
        paymentType: PAYMENT_TYPE_ETH,
        paymentSubType: req.body.paymentSubType,
      });

       order = await order.save();
    }

    return success(res, {
      ...await sessionProvider.getOrCreate(user._id),
      order,
    });

  } catch (e) {
    logger.error(e)
    return next(e)
  }
}

export const checkOut = async (req, res, next) => {

  try {

    await runCheckoutValidation(req)

    const investorsExisted = await investorProvider.byParentId(req.user)
    const user = await userProvider.saveOnBoardRequest(req.body)

    await syncOnfidoData(user, investorsExisted)

    const order = await orderProvider.getOrderOrCreate(user)
    const updatedOrder = await orderProvider.update(order, req.body)

    await userProvider.completeRegistration(user)

    return success(res, {
      order: updatedOrder,
      ...await sessionProvider.getOrCreate(user._id),
    })

  } catch (e) {
    logger.error(e)
    return next(e)
  }
}

