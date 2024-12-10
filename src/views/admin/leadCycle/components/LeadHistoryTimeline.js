import { Box, Flex, Text } from "@chakra-ui/react";

function formatDateTime(date) {
    const options = { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    
    return date.toLocaleString('en-GB', options).replace(',', '');
}

export default function LeadHistoryTimeline({ timelineData }) {
  return (
    <>
      {timelineData.map((item) => {
        return (
          <Flex
            pb={8}
            pl={8}
            borderLeft={"2px solid grey"}
            alignItems={"center"}
            flexDir={"row"}
            position={"relative"}
          >
            <Box>
              <Text color={"#858585"}>
                {formatDateTime(new Date(item?.updatedAt))}
              </Text>
              {item?.type === "creation" && (
                <Text color={"black"} fontSize={18} mb={3}>
                  Lead created by
                  <strong> {item?.updatedBy}</strong>
                </Text>
              )}
              {item?.type === "assignment-manager" && (
                <div>
                  <Text color={"black"} fontSize={18} mb={1}>
                    Lead assigned to manager:
                    <strong>
                      {" "}
                      <u>{item?.updatedData}</u>
                    </strong>
                  </Text>
                  <Box display={"flex"} alignItems="center" fontSize={12}>
                    <Text mr={1}>By</Text>{" "}
                    <Text color={"brand.500"}>{item?.updatedBy}</Text>
                  </Box>
                </div>
              )}

              {item?.type === "assignment-agent" && (
                <div>
                  <Text color={"black"} fontSize={18} mb={1}>
                    Lead assigned to agent:
                    <strong>
                      {" "}
                      <u>{item?.updatedData}</u>
                    </strong>
                  </Text>
                  <Box display={"flex"} alignItems="center" fontSize={12}>
                    <Text mr={1}>By</Text>{" "}
                    <Text color={"brand.500"}>{item?.updatedBy}</Text>
                  </Box>
                </div>
              )}

              {item?.type === "status" && (
                <div>
                  <Text color={"black"} fontSize={18} mb={1}>
                    Status changed to:
                    <strong>
                      {" "}
                      <u>{item?.updatedData}</u>
                    </strong>
                  </Text>
                  <Box display={"flex"} alignItems="center" fontSize={12}>
                    <Text mr={1}>By</Text>{" "}
                    <Text color={"brand.500"}>{item?.updatedBy}</Text>
                  </Box>
                </div>
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
          </Flex>
        );
      })}
    </>
  );
}
