import { log } from "@graphprotocol/graph-ts";
import { NFTListed as ListEvent } from "../../types/Market/Market";
import { NFT, Participant } from "../../types/schema";

export function handleNFTListed(event: ListEvent): void {
  let nftId =
    event.params.lotteryAddress.toHex() + "-" + event.params.tokenId.toString();
  let nft = NFT.load(nftId);
  log.debug(nft!.id, []);
  let marketParticipant = Participant.load(event.address.toHex());
  if (marketParticipant === null) {
    marketParticipant = new Participant(event.address.toHex());
  }
  let sellerParticipant = Participant.load(event.params.seller.toHex());
  if (sellerParticipant === null) {
    sellerParticipant = new Participant(event.params.seller.toHex());
  }
  log.debug(marketParticipant.id, []);
  nft!.owner = marketParticipant.id;
  log.debug(sellerParticipant.id, []);
  nft!.seller = sellerParticipant.id;
  nft!.price = event.params.price;
  marketParticipant.save();
  nft!.save();
}
