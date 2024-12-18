import { Box, Flex, Text } from "@chakra-ui/react";

export default function LeadHistoryTimeline({ timelineData }) {
  return (

    <>
      {timelineData.map((item) => {
        return <Flex
          pb={8}
          pl={8}
          borderLeft={"2px solid grey"}
          alignItems={"center"}
          flexDir={"row"}
          position={"relative"}
        >
          <Box>
            <Text color={"#858585"}>{item?.dateTime}</Text>
            <Text color={"black"} fontSize={18} mt={2} mb={3}>
              {item?.type === "lead" ? "Lead created by " : "Call made by "}
              <strong>{item?.createdBy}</strong>
            </Text>
            <Text fontStyle={"italic"} color={"#474747"}>{item?.callNotes && ('\"' + item?.callNotes + '\"')}</Text>
            {item?.type === "call" && (
              <Text mt={2} color={"#1f7eeb"}>Lasted for {item?.duration}</Text>
            )}
          </Box>
          <Box
            width={30}
            height={30}
            bg={"#1f7eeb"}
            borderRadius={"9999"}
            position={"absolute"}
            top={0}
            transform={"translateX(-53%)"}
            left={"0"}
          ></Box>
        </Flex>;
      })}
    </>
  );
}
