import { EscrowCreated as EscrowCreatedEvent } from "../types/Factory/Factory";
import {
  ADDRESS_ZERO,
  FACTORY_ADDRESS,
  ONE_BI,
  ZERO_BI,
} from "../utils/contants";
import { Factory, Lottery, Participant } from "../types/schema";
import { LotteryEscrow } from "../types/Factory/LotteryEscrow";
import {
  LotteryEscrow as LotteryEscrowTemplate,
  NFTMetadata as NFTMetadataTemplate,
} from "../types/templates";

export function handleEscrowCreated(event: EscrowCreatedEvent): void {
  let factory = Factory.load(FACTORY_ADDRESS);
  if (factory === null) {
    factory = new Factory(FACTORY_ADDRESS);
    factory.lotteryCount = ZERO_BI;
    factory.owner = ADDRESS_ZERO;
    factory.registered = [];
  }
  let registeredAddresses = factory.registered;
  registeredAddresses.push(event.params.escrowAddress);
  factory.registered = registeredAddresses;

  factory.lotteryCount = factory.lotteryCount.plus(ONE_BI);
  let participant = Participant.load(event.transaction.from.toHex());
  if (participant === null) {
    participant = new Participant(event.transaction.from.toHex());
    participant.save();
  }
  const lottery = new Lottery(event.params.escrowAddress.toHex());

  lottery.createAtTimestamp = event.block.timestamp;
  lottery.createAtBlockNumber = event.block.number;
  lottery.concertId = event.params.concertId;
  lottery.ticketType = event.params.ticketType;
  lottery.completeDraw = false;
  lottery.organizer = participant.id;

  let lotteryContract = LotteryEscrow.bind(event.params.escrowAddress);
  let nameCall = lotteryContract.try_name();
  let priceCall = lotteryContract.try_price();
  let urlCall = lotteryContract.try_url();
  let ddlCall = lotteryContract.try_ddl();
  let ticketCountCall = lotteryContract.try_ticketCount();
  let remainingTicketCountCall = lotteryContract.try_remainingTicketCount();
  lottery.price = priceCall.reverted ? ZERO_BI : priceCall.value;
  lottery.url = urlCall.reverted ? "" : urlCall.value;
  lottery.ticketCount = ticketCountCall.reverted
    ? ZERO_BI
    : ticketCountCall.value;
  lottery.remainingTicketCount = remainingTicketCountCall.reverted
    ? ZERO_BI
    : remainingTicketCountCall.value;
  lottery.ddl = ddlCall.reverted ? ZERO_BI : ddlCall.value;
  lottery.name = urlCall.reverted
    ? event.transaction.from.toHex()
    : nameCall.value;
  let tokenURI = lottery.url;
  let ipfsHash = "";
  if (tokenURI.startsWith("ipfs://")) {
    ipfsHash = tokenURI.split("ipfs://")[1];
  } else {
    ipfsHash = "QmVWjjQfgKUAfzpYL2uQXftQiPrUR6h2jcaPxkf6qguZrq";
  }
  lottery.nftMetadata = ipfsHash;
  NFTMetadataTemplate.create(ipfsHash);
  LotteryEscrowTemplate.create(event.params.escrowAddress);
  factory.save();
  lottery.save();
}
