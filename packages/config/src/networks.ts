export type NetworkName = 'mainnet' | 'testnet';

export interface NetworkPreset {
  name: NetworkName;
  cashAddressPrefix: string;
}

export const NETWORK_PRESETS: Record<NetworkName, NetworkPreset> = {
  mainnet: {
    name: 'mainnet',
    cashAddressPrefix: 'ecash:'
  },
  testnet: {
    name: 'testnet',
    cashAddressPrefix: 'ectest:'
  }
};

export const getNetworkPreset = (network: NetworkName): NetworkPreset => NETWORK_PRESETS[network];
