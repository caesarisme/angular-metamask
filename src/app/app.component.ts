import { Component } from '@angular/core';
import { ThirdWebService } from './third-web.service';
import { PageStepEnum, WalletProviderEnum } from './types';
import WethContract_abi from './WethContract_abi';
import { ethers } from 'ethers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  address = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
  randomAddress?: string;
  wei = 1;

  pageStep = PageStepEnum.ConnectWallet;
  PageStepEnum = PageStepEnum;

  latestTransaction?: ethers.Transaction;

  constructor(private _thirdWebService: ThirdWebService) { }

  async ngOnInit() {
    const randomWallet = ethers.Wallet.createRandom();
    this.randomAddress = await randomWallet.getAddress();
  }

  async connectWalletHandler() {
    await this._thirdWebService.connectWallet(WalletProviderEnum.Metamask);

    this.pageStep = PageStepEnum.InitiateTransaction;
  }

  async confirmTransaction() {
    const contract = this._thirdWebService.connectContract(
      this.address,
      WethContract_abi
    );

    const newTransaction = await contract['approve'](this.randomAddress, 1);
    this.latestTransaction = newTransaction;

    newTransaction.wait().then((res: any) => {
      console.log('WAIT RES', res);
    });

    this.pageStep = PageStepEnum.TransactionHistory;
  }

  getDetails() {
    this._thirdWebService._etherScanProvider
      ?.getTransaction(this.latestTransaction!.hash as string)
      .then((res) => {
        console.log(res);
      });
  }
}
