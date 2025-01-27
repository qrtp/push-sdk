import { ProgressHookType } from './types';
type ProgressHookTypeFunction = (...args: any[]) => ProgressHookType;

const PROGRESSHOOK: Record<
  string,
  ProgressHookType | ProgressHookTypeFunction
> = {
  /**
   * PUSH-CREATE PROGRESSHOOKS
   */
  'PUSH-CREATE-01': {
    progressId: 'PUSH-CREATE-01',
    progressTitle: 'Generating Secure Profile Signature',
    progressInfo:
      'This step is only done for first time users and might take a few seconds. PGP keys are getting generated to provide you with secure yet seamless chat',
    level: 'INFO',
  },
  'PUSH-CREATE-02': {
    progressId: 'PUSH-CREATE-02',
    progressTitle: 'Signing Generated Profile',
    progressInfo:
      'This step is only done for first time users. Please sign the message to continue.',
    level: 'INFO',
  },
  'PUSH-CREATE-03': {
    progressId: 'PUSH-CREATE-03',
    progressTitle: 'Encrypting Generated Profile',
    progressInfo: 'Encrypting your keys. Please sign the message to continue.',
    level: 'INFO',
  },
  'PUSH-CREATE-04': {
    progressId: 'PUSH-CREATE-04',
    progressTitle: 'Syncing Generated Profile',
    progressInfo:
      'Please sign the message to continue. Steady lads, chat is almost ready!',
    level: 'INFO',
  },
  'PUSH-CREATE-05': {
    progressId: 'PUSH-CREATE-05',
    progressTitle: 'Setup Complete',
    progressInfo: '',
    level: 'SUCCESS',
  },
  /**
   * PUSH-UPGRADE PROGRESSHOOKS
   */
  /**
   * @deprecated
   */
  'PUSH-UPGRADE-01': {
    progressId: 'PUSH-UPGRADE-01',
    progressTitle: 'Generating New Profile Signature',
    progressInfo:
      'Trying to Upgrade Push Chat Keys to latest version. Please sign the message to continue.',
    level: 'INFO',
  },
  'PUSH-UPGRADE-02': {
    progressId: 'PUSH-UPGRADE-02',
    progressTitle: 'Decrypting Old Profile',
    progressInfo:
      'Trying to Upgrade Push Chat Keys to latest version. Please sign the message to continue.',
    level: 'INFO',
  },
  /**
   * @deprecated
   */
  'PUSH-UPGRADE-03': {
    progressId: 'PUSH-UPGRADE-03',
    progressTitle: 'Generating Encrypted New Profile',
    progressInfo:
      'Trying to Upgrade Push Chat Keys to latest version. Encrypting Push Chat Keys with latest version. Please sign the message to continue.',
    level: 'INFO',
  },
  /**
   * @deprecated
   */
  'PUSH-UPGRADE-04': {
    progressId: 'PUSH-UPGRADE-04',
    progressTitle: 'Syncing New Profile',
    progressInfo:
      'Please sign the message to continue. Steady lads, chat is almost ready!',
    level: 'INFO',
  },
  'PUSH-UPGRADE-05': {
    progressId: 'PUSH-UPGRADE-05',
    progressTitle: 'Upgrade Completed, Welcome to Push Chat',
    progressInfo: '',
    level: 'SUCCESS',
  },
  /**
   * PUSH-DECRYPT PROGRESSHOOKS
   */
  'PUSH-DECRYPT-01': {
    progressId: 'PUSH-DECRYPT-01',
    progressTitle: 'Decrypting Profile',
    progressInfo: 'Please sign the transaction to decrypt profile',
    level: 'INFO',
  },
  'PUSH-DECRYPT-02': {
    progressId: 'PUSH-DECRYPT-02',
    progressTitle: 'Push Profile Unlocked',
    progressInfo: 'Unlocking push profile',
    level: 'SUCCESS',
  },
  /**
   * PUSH-AUTH-UPDATE PROGRESSHOOKS
   */
  'PUSH-AUTH-UPDATE-01': (pgpEncryptionVersion: string) => {
    return {
      progressId: 'PUSH-AUTH-UPDATE-01',
      progressTitle: 'Generating New Profile Signature',
      progressInfo: `Trying to Update Push Chat Keys to ${pgpEncryptionVersion} version. Please sign the message to continue.`,
      level: 'INFO',
    };
  },
  'PUSH-AUTH-UPDATE-02': (pgpEncryptionVersion: string) => {
    return {
      progressId: 'PUSH-AUTH-UPDATE-02',
      progressTitle: 'Generating New Encrypted Profile',
      progressInfo: `Encrypting Push Chat Keys with ${pgpEncryptionVersion} version. Please sign the message to continue.`,
      level: 'INFO',
    };
  },
  'PUSH-AUTH-UPDATE-03': {
    progressId: 'PUSH-AUTH-UPDATE-03',
    progressTitle: 'Syncing Updated Profile',
    progressInfo:
      'Please sign the message to continue. Steady lads, chat is almost ready!',
    level: 'INFO',
  },
  'PUSH-AUTH-UPDATE-04': {
    progressId: 'PUSH-AUTH-UPDATE-04',
    progressTitle: 'Update Completed, Welcome to Push Chat',
    progressInfo: '',
    level: 'SUCCESS',
  },
  'PUSH-AUTH-UPDATE-05': {
    progressId: 'PUSH-AUTH-UPDATE-05',
    progressTitle: 'Generating New Profile Signature',
    progressInfo: `Trying to Update Push Profile creds. Please sign the message to continue.`,
    level: 'INFO',
  },
  'PUSH-AUTH-UPDATE-06': {
    progressId: 'PUSH-AUTH-UPDATE-06',
    progressTitle: 'Generating New Profile Signature',
    progressInfo: `Encrypting Push Chat Keys with new creds. Please sign the message to continue.`,
    level: 'INFO',
  },
  /**
   * PUSH-DECRYPT-AUTH PROGRESSHOOKS
   */
  'PUSH-DECRYPT-AUTH-01': {
    progressId: 'PUSH-DECRYPT-AUTH-01',
    progressTitle: 'Decrypting Profile Creds',
    progressInfo: 'Please sign the transaction to decrypt profile creds',
    level: 'INFO',
  },
  'PUSH-DECRYPT-AUTH-02': {
    progressId: 'PUSH-DECRYPT-AUTH-02',
    progressTitle: 'Push Profile Creds Unlocked',
    progressInfo: 'Unlocking push profile creds',
    level: 'SUCCESS',
  },
  /**
   * PUSH-PROFILE-UPDATE PROGRESSHOOKS
   */
  'PUSH-PROFILE-UPDATE-01': {
    progressId: 'PUSH-PROFILE-UPDATE-01',
    progressTitle: 'Syncing Updated Profile',
    progressInfo: 'Steady lads, your profile is getting a new look!',
    level: 'INFO',
  },
  'PUSH-PROFILE-UPDATE-02': {
    progressId: 'PUSH-PROFILE-UPDATE-02',
    progressTitle: 'Profile Update Completed, Welcome to Push Chat',
    progressInfo: '',
    level: 'SUCCESS',
  },
  /**
   * PUSH-ERROR PROGRESSHOOKS
   */
  'PUSH-ERROR-00': (functionName: string, err: string) => {
    return {
      progressId: 'PUSH-ERROR-00',
      progressTitle: 'Non Specific Error',
      progressInfo: `[Push SDK] - API  - Error - API ${functionName}() -: ${err}`,
      level: 'ERROR',
    };
  },
  'PUSH-ERROR-01': (err: string) => {
    return {
      progressId: 'PUSH-ERROR-01',
      progressTitle: 'Upgrade Profile Failed',
      progressInfo: `[Push SDK] - API  - Error - API decryptPgpKey() -: ${err}`,
      level: 'WARN',
    };
  },
};
export default PROGRESSHOOK;
