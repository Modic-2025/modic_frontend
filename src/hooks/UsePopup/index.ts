import { useState } from "react";

const UsePopup = (
  open: boolean = false,
  title: string = "",
  desc?: string
): [
  boolean,
  (v: boolean) => void,
  string,
  (v: string) => void,
  string,
  (v: string) => void,
] => {
  const [_open, setOpen] = useState<boolean>(open);
  const [_title, setTitle] = useState<string>(title);
  const [_desc, setDesc] = useState<string>(desc || "");

  return [_open, setOpen, _title, setTitle, _desc, setDesc];
};

export default UsePopup;
