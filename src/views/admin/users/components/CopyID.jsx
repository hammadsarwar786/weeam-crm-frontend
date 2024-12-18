import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BiCopy } from "react-icons/bi";
import { GiTick } from "react-icons/gi";
import { MdDone } from "react-icons/md";

const CopyID = ({ value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value?.trim());
    setIsCopied(true);
    setTimeout(() => {
        setIsCopied(false); 
    }, 4000);
  };

  if(isCopied) {
    return <Button size="sm" color="green.600" display="flex" alignItems="center" columnGap={1}>Copied <MdDone color="green"/> </Button>
  }
  return (
    <Button
      display="flex"
      alignItems={"center"}
      onClick={handleCopy}
      columnGap={1}
      size="sm"
    >
      <BiCopy /> Copy ID
    </Button>
  );
};

export default CopyID;
