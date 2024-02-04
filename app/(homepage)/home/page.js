import Link from "next/link";

import { cookies } from "next/headers";

import AuctionPagination from "../../components/auctionPagination";
import CardAuction from "../../components/cardAuction";

export default async function Home() {
  async function getAllAuctions() {
    try {
      const auctionsResponse = await fetch("http://localhost:8080/auctions", {
        next: { revalidate: 0 },
      });
      const auctions = await auctionsResponse.json();

      return auctions;
    } catch (e) {
      console.log(e);
    }
  }

  const auctions = await getAllAuctions();

  if (!auctions) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="grid grid-rows-auto grid-cols-4 gap-x-14">
          {auctions ? (
            auctions.map((auction) => (
              <>
                <Link href={"/auction-details?id=" + auction.id}>
                  <CardAuction
                    key={auction.id}
                    isHomepage={true}
                    auction={auction}
                  />
                </Link>
              </>
            ))
          ) : (
            <div></div>
          )}
        </div>

        <div className="my-5 mt-10">
          <AuctionPagination />
        </div>
      </div>
    </>
  );
}
