import { Text } from "@chakra-ui/react";
import { useState } from "react";

const LastNoteText = ({ text = "" }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Text
     onClick={() => setExpanded(!expanded)}
      cursor={"pointer"}
      color={expanded ? "black" : "grey"}
    >
      {expanded ? text : text.slice(0, 40)+(text?.trim() ? "..." : "-")}
    </Text>
  );
};

export default LastNoteText;
