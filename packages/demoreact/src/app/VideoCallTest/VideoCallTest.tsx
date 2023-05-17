import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import * as PushAPI from '@pushprotocol/restapi';
import { produce } from 'immer';
import { EnvContext, SocketContext, Web3Context } from '../context';
import { SectionButton } from '../components/StyledComponents';
import VideoPlayer from './VideoPlayer';

interface VideoCallMetaDataType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalingData?: any;
  status: number;
}

const VideoCallTest = () => {
  const { library, account, chainId } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const { epnsSDKSocket, isSDKSocketConnected, feedsSinceLastConnection } =
    useContext<any>(SocketContext);

  const videoObjectRef = useRef<PushAPI.video.Video>();
  const recipientAddressRef = useRef<HTMLInputElement>(null);
  const chatIdRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<PushAPI.VideoCallData>(
    PushAPI.video.initVideoCallData
  );

  const requestHandler = () => {
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft: any) => {
        if (!recipientAddressRef || !recipientAddressRef.current) return;
        if (!chatIdRef || !chatIdRef.current) return;

        draft.local.address = account;
        draft.incoming[0].address = recipientAddressRef.current.value;
        draft.incoming[0].status = PushAPI.VideoCallStatus.INITIALIZED;
        draft.meta.chatId = chatIdRef.current.value;
      });
    });
  };

  const incomingCallHandler = async (
    videoCallMetaData: VideoCallMetaDataType
  ) => {
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft) => {
        draft.local.address = videoCallMetaData.recipientAddress;
        draft.incoming[0].address = videoCallMetaData.senderAddress;
        draft.incoming[0].status = PushAPI.VideoCallStatus.RECEIVED;
        draft.meta.chatId = videoCallMetaData.chatId;
        draft.meta.initiator.address = videoCallMetaData.senderAddress;
        draft.meta.initiator.signal = videoCallMetaData.signalingData;
      });
    });
  };

  const connectHandler = (videoCallMetaData: VideoCallMetaDataType) => {
    videoObjectRef.current?.connect({
      signalData: videoCallMetaData.signalingData,
    });
  };

  // init video object
  useEffect(() => {
    if (!library || !account || !chainId || !env) return;

    (async () => {
      const user = await PushAPI.user.get({ account, env });
      let pgpPrivateKey = null;
      const librarySigner = await library.getSigner(account);
      if (user?.encryptedPrivateKey) {
        pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          account,
          signer: librarySigner,
          env,
        });
      }

      videoObjectRef.current = new PushAPI.video.Video({
        signer: library.getSigner(account),
        chainId,
        pgpPrivateKey,
        env,
        setData,
      });
    })();
  }, [library, account, chainId, env]);

  // establish socket connection
  useEffect(() => {
    if (!epnsSDKSocket?.connected) {
      epnsSDKSocket?.connect();
    }
  }, [epnsSDKSocket]);

  // handle request state change
  useEffect(() => {
    (async () => {
      if (data.incoming[0].status === PushAPI.VideoCallStatus.INITIALIZED) {
        if (!data.local.stream) {
          await videoObjectRef.current?.create({ video: true, audio: true });
        } else {
          await videoObjectRef.current?.request({
            senderAddress: data.local.address,
            recipientAddress: data.incoming[0].address,
            chatId: data.meta.chatId,
          });
        }
      }
    })();
  }, [data.incoming, data.local.address, data.local.stream, data.meta.chatId]);

  // receive video call notifications
  useEffect(() => {
    if (!isSDKSocketConnected || feedsSinceLastConnection.length === 0) return;

    const { payload } =
      feedsSinceLastConnection[feedsSinceLastConnection.length - 1] || {};

    if (
      !Object.prototype.hasOwnProperty.call(payload, 'data') ||
      !Object.prototype.hasOwnProperty.call(payload['data'], 'additionalMeta')
    )
      return;

    const additionalMeta = JSON.parse(payload['data']['additionalMeta']);
    if (!additionalMeta) return;

    console.log('RECIEVED ADDITIONAL META', additionalMeta);

    if (additionalMeta.status === PushAPI.VideoCallStatus.INITIALIZED) {
      incomingCallHandler(additionalMeta);
    } else if (
      additionalMeta.status === PushAPI.VideoCallStatus.RECEIVED ||
      additionalMeta.status === PushAPI.VideoCallStatus.RETRY_RECEIVED
    ) {
      connectHandler(additionalMeta);
    } else if (additionalMeta.status === PushAPI.VideoCallStatus.DISCONNECTED) {
      window.location.reload();
    } else if (
      additionalMeta.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.request({
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    } else if (
      additionalMeta.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      !videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.acceptRequest({
        signalData: additionalMeta.signalingData,
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    }
  }, [feedsSinceLastConnection]);

  return (
    <div>
      <Header>
        <h2>Video Call Test page</h2>
      </Header>

      <HContainer>
        <input
          ref={recipientAddressRef}
          placeholder="recipient address"
          type="text"
        />
        <input ref={chatIdRef} placeholder="chat id" type="text" />
      </HContainer>

      <HContainer>
        <SectionButton onClick={requestHandler}>Request</SectionButton>
        <SectionButton
          disabled={
            data.incoming[0].status !== PushAPI.VideoCallStatus.RECEIVED
          }
        >
          Accept Request
        </SectionButton>
        <SectionButton
          disabled={
            data.incoming[0].status === PushAPI.VideoCallStatus.UNINITIALIZED
          }
        >
          Disconect
        </SectionButton>
        <SectionButton
          disabled={
            data.incoming[0].status === PushAPI.VideoCallStatus.UNINITIALIZED
          }
        >
          Toggle Video
        </SectionButton>
        <SectionButton
          disabled={
            data.incoming[0].status === PushAPI.VideoCallStatus.UNINITIALIZED
          }
        >
          Toggle Audio
        </SectionButton>
      </HContainer>

      <HContainer>
        <p>LOCAL VIDEO: {data.local.video ? 'TRUE' : 'FALSE'}</p>
        <p>LOCAL AUDIO: {data.local.audio ? 'TRUE' : 'FALSE'}</p>
        <p>INCOMING VIDEO: {data.incoming[0].video ? 'TRUE' : 'FALSE'}</p>
        <p>INCOMING AUDIO: {data.incoming[0].audio ? 'TRUE' : 'FALSE'}</p>
      </HContainer>

      <HContainer>
        <VContainer>
          <h2>Local Video</h2>
          <VideoPlayer stream={data.local.stream} />
        </VContainer>
        <VContainer>
          <h2>Incoming Video</h2>
          <VideoPlayer stream={data.incoming[0].stream} />
        </VContainer>
      </HContainer>
    </div>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
`;

const VContainer = styled(HContainer)`
  flex-direction: column;
  width: fit-content;
  height: fit-content;
`;

export default VideoCallTest;
