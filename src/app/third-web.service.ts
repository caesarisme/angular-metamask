import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { WalletProviderEnum } from './types';

@Injectable()
export class ThirdWebService {
  private _provider?: ethers.providers.Web3Provider;
  public _etherScanProvider?: ethers.providers.EtherscanProvider;
  private _signer?: ethers.Signer;
  public _connectedContract?: any;

  constructor() {
    this._etherScanProvider = new ethers.providers.EtherscanProvider(
      'goerli',
      'JG5IGKBD5EIVUZ3UZP2B1NBFENG4EIKEC2'
    );
  }

  public async connectWallet(walletProvider: WalletProviderEnum) {
    if (walletProvider === WalletProviderEnum.Metamask) {
      return this.connectMetamask();
    }
  }

  private async connectMetamask() {
    const ethereum = (window as any)['ethereum'];

    if (ethereum) {
      const tempProvider = new ethers.providers.Web3Provider(ethereum);

      this._provider = tempProvider;
      this._signer = tempProvider.getSigner();

      const requestAccountsResponse = await tempProvider.send(
        'eth_requestAccounts',
        []
      );

      console.log('requestAccountsResponse', requestAccountsResponse);
    } else {
      throw new Error('Need to install MetaMask!');
    }
  }

  public getProvider() {
    return this._provider;
  }

  public getSigner() {
    return this._signer;
  }

  public connectContract(address: string, abi: any) {
    const tempContract = new ethers.Contract(address, abi, this._signer);
    return tempContract;
  }
}
