import userProvider from '../providers/user'
import investorProvider from '../providers/investor'
import onfidoProvider from '../providers/onfido'
import socket from '../socket'
import { SOCKET_ERROR_TYPE } from '../constants'
import logger from '../helpers/logger'

export const syncOnfidoDataAsync = ((user, investorsPrev) => {
  return new Promise((resolve, reject) => {
    try {
      const synced = syncOnfidoData(user, investorsPrev)

      resolve(synced)

    } catch (err) {
      console.log(err)

      socket.emitTo(user._id, SOCKET_ERROR_TYPE, {err})

      reject(err)
    }
  }).catch((err) => {
    console.log(err)
  })
})

export const syncOnfidoData = async (user, investorsPrev) => {

  return await new Promise(async (resolve, reject) => {

    const investorsCurrent = await investorProvider.byParentId(user)
    const updateOnfido = await userProvider.collectOnfidoUpdates(user, investorsCurrent, investorsPrev)

    if (updateOnfido.length > 0) {

      const promises = [];
      for (let upData of updateOnfido) {
        const {investorId, isNewUser, investorData} = upData

        promises.push(
          await new Promise (async(resolve, reject) => {
            try {
              const applicant = await onfidoProvider.setFormMainData(investorData)
              logger.info('SEND APPLICANT ' + applicant.id)
              return resolve(applicant)

            } catch (err) {
              logger.info(' IS USER ' + investorId + ' NEW: ' + isNewUser);
              if (isNewUser) await investorProvider.removeInvestorById(investorId)

              reject(err)
            }

          }).then(async (applicant) => {

            logger.info('SAVE APPLICANT ' + applicant.id)
            logger.info(applicant);

            try {
              await investorProvider.addApplicantData(investorId, applicant)
              resolve();

            } catch(err) {
              reject(err)
            }
          }).catch((err) => {
            reject(err)
          })
        )
      }

      try {
        const syncs = await Promise.all(promises)
        resolve(syncs)
      } catch (err) {
        reject(err)
      }
    }

    resolve()
  })
}


export const syncOnfidoFile = async ({investorId, index}, file, docType = 'document') => {
  const applicant = await investorProvider.byPrimaryKey(investorId)
  const callbackField = index ? 'investors[' + index + ']' : 'owner'

  if (typeof (applicant) !== 'undefined' && typeof (applicant.applicant.id) !== 'undefined') {
    const applicantData = {
      applicantId: applicant.applicant.id,
      callbackField: callbackField,
    }

    const runUpload = async (docType) => {
      switch (docType) {
        case 'selfie':
          return await onfidoProvider.faceUpload(applicantData, file.getPath())

        default:
          return await onfidoProvider.documentUpload(applicantData, file.getPath())
      }
    }

    return await runUpload(docType)
  }
}

