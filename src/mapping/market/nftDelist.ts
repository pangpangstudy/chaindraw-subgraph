import { NFTDelisted as DelistEvent } from "../../types/Market/Market";
import { Lottery, NFT, Participant } from "../../types/schema";

export function handleNFTDelist(event: DelistEvent): void {
  let nftId =
    event.params.lotteryAddress.toHex() + "-" + event.params.tokenId.toString();
  let nft = NFT.load(nftId);
  let lottery = Lottery.load(event.params.lotteryAddress.toHex());
  let sellerParticipant = Participant.load(event.params.seller.toHex());

  nft!.owner = sellerParticipant!.id;
  nft!.seller = null;
  nft!.price = lottery!.price;
  nft!.save();
}
