// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Address,
  DataSourceTemplate,
  DataSourceContext,
} from "@graphprotocol/graph-ts";

export class LotteryEscrow extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("LotteryEscrow", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "LotteryEscrow",
      [address.toHex()],
      context,
    );
  }
}

export class NFTMetadata extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("NFTMetadata", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("NFTMetadata", [cid], context);
  }
}
