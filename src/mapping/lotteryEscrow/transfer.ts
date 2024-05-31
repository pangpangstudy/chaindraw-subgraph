import { Address, log } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../../types/Factory/LotteryEscrow";
import { Lottery, NFT, NFTMetadata, Participant } from "../../types/schema";
import { ADDRESS_ZERO } from "../../utils/contants";

export function handleTransfer(event: TransferEvent): void {
  let lottery = Lottery.load(event.address.toHex());
  let zeroAddress = Address.zero();

  if (event.params.from.equals(zeroAddress)) {
    let toParticipant = Participant.load(event.params.to.toHex());
    if (toParticipant === null) {
      toParticipant = new Participant(event.params.to.toHex());
    }
    let nftId = event.address.toHex() + "-" + event.params.tokenId.toString();
    let nft = NFT.load(nftId);
    if (nft === null) {
      nft = new NFT(nftId);
    }

    let tokenURI = lottery!.url;
    nft.tokenId = event.params.tokenId;
    nft.tokenURI = tokenURI;
    nft.lotteryAddress = event.address.toHex();
    nft.owner = toParticipant.id;
    nft.price = lottery!.price;
    nft.seller = null;
    nft.lotteryAddress = lottery!.id;
    nft.nftMetadata = lottery!.nftMetadata;
    toParticipant.save();
    nft.save();
    log.debug((nft.seller === null).toString(), []);
  }
}
