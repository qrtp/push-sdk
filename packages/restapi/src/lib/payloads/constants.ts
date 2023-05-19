export interface ChainIdToSourceType {
  [key: number]: string;
}

export const CHAIN_ID_TO_SOURCE: ChainIdToSourceType = {
  1: 'ETH_MAINNET',
  5: 'ETH_TEST_GOERLI',
  137: 'POLYGON_MAINNET',
  80001: 'POLYGON_TEST_MUMBAI',
  56: 'BSC_MAINNET',
  97: 'BSC_TESTNET',
  10: 'OPTIMISM_MAINNET',
  420: 'OPTIMISM_TESTNET',
  1442: 'POLYGON_ZK_EVM_TESTNET',
  1101: 'POLYGON_ZK_EVM_MAINNET',
};

export const SOURCE_TYPES = {
  ETH_MAINNET: 'ETH_MAINNET',
  ETH_TEST_GOERLI: 'ETH_TEST_GOERLI',
  POLYGON_MAINNET: 'POLYGON_MAINNET',
  POLYGON_TEST_MUMBAI: 'POLYGON_TEST_MUMBAI',
  BSC_MAINNET: 'BSC_MAINNET',
  BSC_TESTNET: 'BSC_TESTNET',
  OPTIMISM_MAINNET: 'OPTIMISM_MAINNET',
  OPTIMISM_TESTNET: 'OPTIMISM_TESTNET',
  POLYGON_ZK_EVM_TESTNET: 'POLYGON_ZK_EVM_TESTNET',
  POLYGON_ZK_EVM_MAINNET: 'POLYGON_ZK_EVM_MAINNET',
  THE_GRAPH: 'THE_GRAPH',
  PUSH_VIDEO: 'PUSH_VIDEO',
};

export enum IDENTITY_TYPE {
  MINIMAL = 0,
  IPFS = 1,
  DIRECT_PAYLOAD = 2,
  SUBGRAPH = 3,
}

export enum NOTIFICATION_TYPE {
  BROADCAST = 1,
  TARGETTED = 3,
  SUBSET = 4,
}

export enum ADDITIONAL_META_TYPE {
  CUSTOM = 0,
  PUSH_VIDEO = 1,
}

export const DEFAULT_DOMAIN = 'push.org';
