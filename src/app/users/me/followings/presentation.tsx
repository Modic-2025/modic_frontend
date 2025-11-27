"use client";

import { APIFailureMsg } from "@/APIs";
import Fail from "@/components/Popups/Fail";
import { useState } from "react";

const PresentationPage = ({
  children,
  failureMsg,
}: {
  children: React.ReactNode;
  failureMsg: APIFailureMsg;
}) => {
  const [showPopup] = useState<boolean>(false);

  return (
    <>
      {showPopup && <Fail title={failureMsg.title} desc={failureMsg.desc} />}
      {children}
    </>
  );
};

export default PresentationPage;
