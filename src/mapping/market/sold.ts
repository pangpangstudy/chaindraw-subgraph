import { log } from "@graphprotocol/graph-ts";
import { NFTSold as SoldEvent } from "../../types/Market/Market";
import { NFT, Participant } from "../../types/schema";

export function handleNFTSold(event: SoldEvent): void {
  let nftId =
    event.params.lotteryAddress.toHex() + "-" + event.params.tokenId.toString();
  let nft = NFT.load(nftId);
  let buyerParticipant = Participant.load(event.params.buyer.toHex());
  if (buyerParticipant === null) {
    buyerParticipant = new Participant(event.params.buyer.toHex());
  }
  log.debug(event.address.toHex(), []);
  nft!.owner = buyerParticipant.id;
  log.debug(nft!.owner, []);

  nft!.seller = null;
  nft!.price = event.params.price;

  buyerParticipant.save();
  nft!.save();
}
