import logger from '../helpers/logger'
import userProvider from '../providers/user'
import investorProvider from '../providers/investor'
import onfidoProvider from '../providers/onfido'
import {
  ENV_PRODUCTION,
  ONFIDO_CHECK_STATE_FAIL,
  ONFIDO_CHECK_STATE_SUCCESS,
} from '../constants'
import config from '../config'

export const checkStatuses = async () => {
  try {
    const users = await userProvider.getOnfidoUnchecked();
    if (users) {

      logger.info('Unchecked users: ', users.length);

      for (const user of users) {
        try {
          logger.info('Start user # ObjectId("' + user.login + '"')
          let checkItems = [user.owner]

          if (!!checkItems[0]) {
            const checks = await getChecks(checkItems)
            logger.info(checks)

            const isCompleted = checks.filter((c) => {
              return c.isComplete
            })

            for (const ch of isCompleted) {
              logger.info('Investor # ObjectId("' + ch.investorId + '") :: checked with status ' + ch.state);

              const i = await investorProvider.byPrimaryKey(ch.investorId)
              await i.setOnfidoChecked(ch.state)
            }

            if (isCompleted.length === checkItems.length) {
              const isFailed = isCompleted.filter((c) => {
                return parseInt(c.state) === ONFIDO_CHECK_STATE_FAIL
              })
              let checkState = isFailed.length ? ONFIDO_CHECK_STATE_FAIL : ONFIDO_CHECK_STATE_SUCCESS

              logger.info('User # ObjectId("' + user._id + '") :: checked with status ' + checkState)
              await user.setOnfidoChecked(checkState)

            } else {
              logger.info('User # ObjectId("' + user._id + '") :: still pending')
            }
          }

          if (config.environment !== ENV_PRODUCTION) await pause()
        }catch (e) {
         logger.error(`user error ${user && user.login}`,e)
        }
      }

    } else {
      logger.info('No unchecked users found');

    }

  } catch (e) {
    logger.error('Some problem on checking Onfido statuses', e);
  }
}

const pause = async () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 5000)
  })
}

const getChecks = async(list) => {
  return await new Promise(async (resolve, reject) => {
    try {
      const promises = []

      list.forEach((inv) => {
        promises.push(onfidoProvider.getCheckStatus(inv._id, inv.applicant.id, inv.checkId))
      })

      const checks = await Promise.all(promises)
      resolve(checks)

    } catch (e) {
      reject(e)
    }
  })
}


