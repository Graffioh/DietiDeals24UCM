"use client";

import { Label } from "@/components/shadcn-ui/label";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { PhoneInput } from "@/components/phoneinput/phone-input";
import { Input } from "@/components/shadcn-ui/input";
import { useEffect } from "react";

export default function AdditionalPrivateProfileInfo({
  currentUser,
  phone,
  onPhoneChange,
}) {

  useEffect(() => {
    if (currentUser?.telephoneNumber) {
      onPhoneChange(currentUser?.telephoneNumber);
    }
  }, [currentUser?.telephoneNumber, onPhoneChange]);

  return (
    <>
      {currentUser ? (
        currentUser.id ? (
          <>
            <div>
              <Label className="mb-2 flex">Bio</Label>
              <Textarea
                className="resize-none bg-white"
                placeholder="Type your description here."
                id="biography"
                defaultValue={currentUser ? currentUser.biography : ""}
              />
            </div>

            <div>
              <Label className="mb-2 flex">Phone Number</Label>
              <PhoneInput value={phone} onChange={onPhoneChange} />
            </div>

            <div>
              <Label className="mb-2 flex">Website</Label>
              <Input
                className="h-9 bg-white"
                type="url"
                id="website"
                placeholder="Website"
                defaultValue={currentUser ? currentUser.website : ""}
              />
            </div>
          </>
        ) : (
          <div></div>
        )
      ) : (
        <div></div>
      )}
    </>
  );
}
