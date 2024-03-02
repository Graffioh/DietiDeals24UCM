"use client";
import { useState, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUserContext } from "../providers/userProvider";

export default function PlaceOfferDialog({ auction }) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const {currentUser} = useUserContext();

  const offerAmountRef = useRef(null);

  async function onSubmit(event) {
    event.preventDefault();

    const offerAmount = offerAmountRef
      ? offerAmountRef.current
        ? offerAmountRef.current.value
        : -1
      : -1;
    const offerFromInputs = {
      id: Date.now(),
      offerAmount:
        auction.auctionType === "descending"
          ? auction.currentOffer
          : offerAmount,
      idUserAccount: currentUser.id,
      idAuction: auction.id,
    };

    if (
      auction.currentOffer < offerAmount ||
      auction.auctionType === "descending"
    ) {
      toast.success("Your offer has been placed correctly.");
      await fetch(process.env.NEXT_PUBLIC_BASEURL + "/offers/insert", {
        method: "POST",
        body: JSON.stringify(offerFromInputs),
        headers: { "Content-Type": "application/json" },
      });

      await fetch(
        process.env.NEXT_PUBLIC_BASEURL +
          "/auctions/" +
          auction.id +
          "/current-offer?newCurrentOffer=" +
          offerAmount,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (auction.auctionType === "descending") {
        fetch(
          process.env.NEXT_PUBLIC_BASEURL +
            "/auctions/" +
            auction.id +
            "/is-over",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
          })
          .then(() => {
            console.log("Auction has ended");
          })
          .catch((error) => {
            console.error("Failed to fetch: ", error);
          });

        const noti = {
          id: auction.id + auction.idUserAccount,
          auctionName: auction.auctionName,
          idUserAccount: auction.idUserAccount,
          idAuction: auction.id,
        };

        fetch(process.env.NEXT_PUBLIC_BASEURL + "/notifications/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noti),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
          })
          .then(() => {
            console.log("Notifications for auction ended created successfully");
          })
          .catch((error) => {
            console.error(
              "Error while creating notification: " + error.message
            );
          });
      }

      setDialogOpen(false);
    } else if (
      auction.auctionType != "descending" &&
      auction.currentOffer >= offerAmount
    ) {
      toast.error(
        "You must place an offer greater than the max current offer!"
      );
    }
  }

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="default"
            className="p-7 text-lg"
            onClick={
              auction.auctionType === "descending" ? onSubmit : openDialog
            }
          >
            Place Offer
          </Button>
        </AlertDialogTrigger>
        {isDialogOpen && (
          <AlertDialogContent className="w-64 flex flex-col items-center">
            <AlertDialogHeader>
              <AlertDialogTitle>Place an offer</AlertDialogTitle>
              <AlertDialogDescription>
                Current max offer: {auction.currentOffer} €
              </AlertDialogDescription>
              <div className="flex justify-center">
                <Input ref={offerAmountRef} type="number" className="w-48" />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDialog}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onSubmit}>Place</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
}
