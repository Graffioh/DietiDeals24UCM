import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function FixedTimeAuctionDetailsInputs({ currentAuction }) {
  return (
    <>
      <div className="absolute ml-5 mt-[10em]">
        <Label className="flex mb-2">
          Current offer<div className="text-red-500"></div>
        </Label>
        <Input
          className="max-w-[20em] h-9 bg-white"
          type="text"
          id="current-offer"
          placeholder="Placeholder"
          defaultValue={currentAuction.currentOffer}
          readOnly
        />
      </div>
      <div className="absolute ml-[19em] mt-[10em]">
        <Label className="flex mb-2">
          Expire time<div className="text-red-500"></div>
        </Label>
        <Input
          className="max-w-[20em] h-9 bg-white"
          type="text"
          id="expire-time"
          placeholder="Placeholder"
          readOnly
        />
      </div>
    </>
  );
}
