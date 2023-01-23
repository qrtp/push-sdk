import axios from 'axios';
import {
    getAPIBaseUrls,
    isValidETHAddress,
} from '../helpers';
import Constants from '../constants';
import {
    AccountEnvOptionsType, IUser
} from '../types';
import {
    IUpdateGroupRequestPayload,
    updateGroupPayload,
    createUserIfNecessary,
    sign
} from './helpers';

import {
    decryptWithWalletRPCMethod,
} from '../../../src/lib/helpers';


/**
 *  PUT /v1/chat/group/:chatId
 */


export interface ChatUpdateGroupType extends AccountEnvOptionsType {
        chatId: string,
        groupName: string,
        numberOfERC20: number,
        numberOfNFTs: number,
        profilePicture: string,
        addMembers: Array < string >,
        removeMembers: Array < string >,
        admin: string
}


export const updateGroup = async (
  options: ChatUpdateGroupType
) => {
    const {
        chatId,
        groupName,
        numberOfERC20,
        numberOfNFTs,
        profilePicture,
        addMembers,
        removeMembers,
        admin,
        account,
        env = Constants.ENV.PROD,
    } = options || {};

    try {

        if (chatId == null || chatId.length == 0) {
            throw new Error(`chatId cannot be null or empty`);
        }

        if (groupName == null || groupName.length == 0) {
            throw new Error(`groupName cannot be null or empty`);
        }

        if (groupName!=null && groupName.length >= 256) {
            throw new Error(`groupName cannot be more than 256 characters`);
        }

        if (addMembers != null && addMembers.length > 0) {
            for(let i = 0; i < addMembers.length; i++) {
                if (!isValidETHAddress(addMembers[i])) {
                    throw new Error(`Invalid member address in addMembers list!`);
                }
            }
        }

        if (removeMembers != null && removeMembers.length > 0) {
            for(let i = 0; i < removeMembers.length; i++) {
                if (!isValidETHAddress(removeMembers[i])) {
                    throw new Error(`Invalid member address in removeMembers list!`);
                }
            }
        }

        if (admin!=null && !isValidETHAddress(admin)) {
            throw new Error(`Invalid admin address!`);
        }

        if (numberOfNFTs!=null && numberOfNFTs < 0) {
            throw new Error(`numberOfNFTs cannot be negative number`);
        }

        if (numberOfERC20!=null && numberOfERC20 < 0) {
            throw new Error(`numberOfERC20 cannot be negative number`);
        }

        const connectedUser : IUser = await createUserIfNecessary({account, env});

        let pvtkey = null;
        if (connectedUser?.encryptedPrivateKey) {
            pvtkey = await decryptWithWalletRPCMethod(
            connectedUser.encryptedPrivateKey,
            account
            );
        }

        const bodyToBeHashed = {
            groupName: groupName,
            profilePicture: profilePicture,
            numberOfERC20: numberOfERC20,
            numberOfNFTs: numberOfNFTs,
            addMembers: addMembers,
            removeMembers: removeMembers,
            chatId: chatId,
            admin: admin
        }

        const signature: string = await sign( {message: JSON.stringify(bodyToBeHashed),  signingKey: pvtkey} );
        const sigType  = "pgp";

        const verificationProof : string = sigType + ":" + signature;


        const API_BASE_URL = getAPIBaseUrls(env);
        const apiEndpoint = `${API_BASE_URL}/v1/chat/group/${chatId}`;
        const body: IUpdateGroupRequestPayload = updateGroupPayload(
        groupName,
        numberOfERC20,
        numberOfNFTs,
        profilePicture,
        addMembers,
        removeMembers,
        admin,
        verificationProof);

        return axios
            .post(apiEndpoint, body)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                throw new Error(err);
            });

    } catch (err) {
        console.error(`[EPNS-SDK] - API  - Error - API send() -:  `, err);
        throw Error(`[EPNS-SDK] - API  - Error - API send() -: ${err}`);
    }
};