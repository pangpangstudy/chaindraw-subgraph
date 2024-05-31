import { LotteryEscrow__ClaimedFund as WinnerEvent } from "../../types/Factory/LotteryEscrow";
import { Lottery, NFT, Participant } from "../../types/schema";
import { ONE_BI, ZERO_BI } from "../../utils/contants";
export function handleWinner(event: WinnerEvent): void {
  const lottery = Lottery.load(event.address.toHex());

  if (!lottery) return;
  let participantId = event.params.winner.toHex();
  let participant = Participant.load(participantId);
  if (participant === null) {
    participant = new Participant(participantId);
  }
  participant.save();
  if (lottery.winners === null) {
    lottery.winners = [];
  }
  lottery.winners!.push(participantId);
  if (lottery.remainingTicketCount) {
    lottery.remainingTicketCount = lottery.remainingTicketCount.minus(ONE_BI);
    if (lottery.remainingTicketCount === ZERO_BI) {
      lottery.completeDraw = true;
    }
  }
  lottery.save();
}
