import { PushAPI } from '@pushprotocol/restapi';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { config } from '../config';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { goerli } from 'viem/chains';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';

// CONFIGS
const { env, showAPIResponse } = config;

/***************** SAMPLE SIGNER GENERATION *********************/
// Uing VIEM
// Random Wallet Signers
const signer = createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: goerli,
  transport: http(),
});
const signerAddress = signer.account.address;
const secondSigner = createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: goerli,
  transport: http(),
});
const secondSignerAddress = secondSigner.account.address;
const thirdSigner = createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: goerli,
  transport: http(),
});
const thirdSignerAddress = thirdSigner.account.address;
// Dummy Wallet Addresses
const randomWallet1 = privateKeyToAccount(generatePrivateKey()).address;
const randomWallet2 = privateKeyToAccount(generatePrivateKey()).address;
const randomWallet3 = privateKeyToAccount(generatePrivateKey()).address;
/****************************************************************/

/***************** SAMPLE GROUP DATA ****************************/
const groupName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupDescription = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';
/***************** SAMPLE GROUP DATA ****************************/

export const runPushAPICases = async (): Promise<void> => {
  console.log(`

██████╗░██╗░░░██╗░██████╗██╗░░██╗░█████╗░██████╗░██╗  ░█████╗░██╗░░░░░░█████╗░░██████╗░██████╗
██╔══██╗██║░░░██║██╔════╝██║░░██║██╔══██╗██╔══██╗██║  ██╔══██╗██║░░░░░██╔══██╗██╔════╝██╔════╝
██████╔╝██║░░░██║╚█████╗░███████║███████║██████╔╝██║  ██║░░╚═╝██║░░░░░███████║╚█████╗░╚█████╗░
██╔═══╝░██║░░░██║░╚═══██╗██╔══██║██╔══██║██╔═══╝░██║  ██║░░██╗██║░░░░░██╔══██║░╚═══██╗░╚═══██╗
██║░░░░░╚██████╔╝██████╔╝██║░░██║██║░░██║██║░░░░░██║  ╚█████╔╝███████╗██║░░██║██████╔╝██████╔╝
╚═╝░░░░░░╚═════╝░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═╝  ░╚════╝░╚══════╝╚═╝░░╚═╝╚═════╝░╚═════╝░
  `);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.initialize');
  const userAlice = await PushAPI.initialize(signer, { env });
  const userBob = await PushAPI.initialize(secondSigner, { env });
  console.log('PushAPI.initialize | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.info');
  const userAliceInfo = await userAlice.info();
  if (showAPIResponse) {
    console.log(userAliceInfo);
  }
  console.log('PushAPI.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.profile.info');
  const userAliceProfileInfo = await userAlice.profile.info();
  if (showAPIResponse) {
    console.log(userAliceProfileInfo);
  }
  console.log('PushAPI.profile.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.profile.update');
  const updatedName = 'Bob The Builder';
  const response = await userAlice.profile.update({ name: updatedName });
  if (showAPIResponse) {
    console.log(response);
  }
  console.log('PushAPI.profile.update | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.chat.list');
  const aliceChats = await userAlice.chat.list('CHATS');
  const aliceRequests = await userAlice.chat.list('REQUESTS');
  if (showAPIResponse) {
    console.log(aliceChats);
    console.log(aliceRequests);
  }
  console.log('PushAPI.chat.list | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.chat.latest');
  const aliceLatestChatWithBob = await userAlice.chat.latest(
    secondSignerAddress
  );
  if (showAPIResponse) {
    console.log(aliceLatestChatWithBob);
  }
  console.log('PushAPI.chat.latest | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.chat.history');
  const aliceChatHistoryWithBob = await userAlice.chat.history(
    secondSignerAddress
  );
  if (showAPIResponse) {
    console.log(aliceChatHistoryWithBob);
  }
  console.log('PushAPI.chat.history | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.chat.send');
  const aliceMessagesBob = await userAlice.chat.send(secondSignerAddress, {
    content: 'Hello Bob!',
    type: 'Text',
  });
  if (showAPIResponse) {
    console.log(aliceMessagesBob);
  }
  console.log('PushAPI.chat.send | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.chat.decrypt');
  const pushSDKSocket = createSocketConnection({
    user: signerAddress,
    socketType: 'chat',
    socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    env: env,
  });
  if (pushSDKSocket) {
    await userAlice.chat.send(secondSignerAddress, {
      content: 'Hello Bob!',
      type: 'Text',
    });
    pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, async (message) => {
      // uncomment after latest sdk deployment
      // await userAlice.chat.decrypt([message]);
      // pushSDKSocket.disconnect();
    });
  }
  console.log('PushAPI.chat.decrypt | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.chat.accept');
  const bobAcceptsRequest = await userBob.chat.accept(signerAddress);
  if (showAPIResponse) {
    console.log(bobAcceptsRequest);
  }
  console.log('PushAPI.chat.accept | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.chat.reject');
  const tempUser = await PushAPI.initialize(thirdSigner, { env });
  await tempUser.chat.send(secondSignerAddress, {
    content: 'Sending Malicious message to bob',
  });
  const bobRejectsRequest = await userBob.chat.reject(thirdSignerAddress);
  if (showAPIResponse) {
    console.log(bobRejectsRequest);
  }
  console.log('PushAPI.chat.reject | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.chat.block');
  const AliceBlocksBob = await userAlice.chat.block([secondSignerAddress]);
  if (showAPIResponse) {
    console.log(AliceBlocksBob);
  }
  console.log('PushAPI.chat.block | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.chat.unblock');
  const AliceUnblocksBob = await userAlice.chat.unblock([secondSignerAddress]);
  if (showAPIResponse) {
    console.log(AliceUnblocksBob);
  }
  console.log('PushAPI.chat.unblock | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.group.create');
  const createdGroup = await userAlice.chat.group.create(groupName, {
    description: groupDescription,
    image: groupImage,
    members: [randomWallet1, randomWallet2],
    admins: [],
    private: false,
  });
  const groupChatId = createdGroup.chatId; // to be used in other examples
  if (showAPIResponse) {
    console.log(createdGroup);
  }
  console.log('PushAPI.group.create | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.group.permissions');
  const grouppermissions = await userAlice.chat.group.permissions(groupChatId);
  if (showAPIResponse) {
    console.log(grouppermissions);
  }
  console.log('PushAPI.group.permissions | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.group.info');
  const groupInfo = await userAlice.chat.group.info(groupChatId);
  if (showAPIResponse) {
    console.log(groupInfo);
  }
  console.log('PushAPI.group.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.group.update');
  const updatedGroup = await userAlice.chat.group.update(groupChatId, {
    description: 'Updated Description',
  });
  if (showAPIResponse) {
    console.log(updatedGroup);
  }
  console.log('PushAPI.group.update | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.group.add');
  const addMember = await userAlice.chat.group.add(groupChatId, {
    role: 'MEMBER',
    accounts: [randomWallet3],
  });
  if (showAPIResponse) {
    console.log(addMember);
  }
  console.log('PushAPI.group.add | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.group.remove');
  const removeMember = await userAlice.chat.group.remove(groupChatId, {
    role: 'MEMBER',
    accounts: [randomWallet3],
  });
  if (showAPIResponse) {
    console.log(removeMember);
  }
  console.log('PushAPI.group.remove | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.group.join');
  const joinGrp = await userBob.chat.group.join(groupChatId);
  if (showAPIResponse) {
    console.log(joinGrp);
  }
  console.log('PushAPI.group.join | Response - 200 OK\n\n');
  //-------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.group.leave');
  const leaveGrp = await userBob.chat.group.leave(groupChatId);
  if (showAPIResponse) {
    console.log(leaveGrp);
  }
  console.log('PushAPI.group.leave | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.group.reject');
  const sampleGrp = await userAlice.chat.group.create('Sample Grp', {
    description: groupDescription,
    image: groupImage,
    members: [secondSignerAddress], // invite bob
    admins: [],
    private: true,
  });
  const rejectGrpJoiningReq = await userBob.chat.group.reject(sampleGrp.chatId);
  if (showAPIResponse) {
    console.log(rejectGrpJoiningReq);
  }
  console.log('PushAPI.group.reject | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.encryption.info');
  const encryptionInfo = await userAlice.encryption.info();
  if (showAPIResponse) {
    console.log(encryptionInfo);
  }
  console.log('PushAPI.encryption.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.encryption.update');
  const PGP_V3 = 'eip191-aes256-gcm-hkdf-sha256';
  const encryptionUpdate = await userAlice.encryption.update(PGP_V3 as any);
  if (showAPIResponse) {
    console.log(encryptionUpdate);
  }
  console.log('PushAPI.encryption.update | Response - 200 OK\n\n');
};
