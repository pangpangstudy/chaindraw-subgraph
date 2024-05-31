import { LotteryEscrow__Deposited as DepositEvent } from "../../types/Factory/LotteryEscrow";
import { Lottery, LotteryParticipant, Participant } from "../../types/schema";

export function handleDeposited(event: DepositEvent): void {
  let participant = Participant.load(event.params.buyer.toHex());
  if (participant === null) {
    participant = new Participant(event.params.buyer.toHex());
  }

  let lottery = Lottery.load(event.address.toHex());
  if (lottery === null) {
    return;
  }

  let lotteryParticipantId =
    event.params.buyer.toHex() + "-" + event.address.toHex();

  let lotteryParticipant = LotteryParticipant.load(lotteryParticipantId);
  if (lotteryParticipant === null) {
    lotteryParticipant = new LotteryParticipant(lotteryParticipantId);
    lotteryParticipant.participant = participant.id;
    lotteryParticipant.lottery = lottery.id;
  }

  lotteryParticipant.save();
  participant.save();
  lottery.save();
}
