import { useState, useEffect } from "react";
import { Box, Grid, GridItem, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { getApi } from "services/api";
import { toast } from "react-toastify";
import DataNotFound from "components/notFoundData";

const LeadNotes = ({ notes}) => {
  // const [notesLoading, setNotesLoading] = useState(false);
  const [allNotes, setAllNotes] = useState(notes);

  useEffect(()=>{setAllNotes(notes)},[notes])

  const textColor = useColorModeValue("gray.500", "white");

  // const fetchLeadNotes = async (lid) => {
  //   try {
  //     setNotesLoading(true);
  //     const leadNotes = await getApi("api/leadnote/" + lid);
  //     setAllNotes(leadNotes.data || []);
  //     setNotesLoading(false);
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Couldn't fetch lead notes");
  //   }
  // };

  // useEffect(() => {
  //   if (lid) {
  //     fetchLeadNotes(lid);
  //   }
  // }, [noteAdded]);

  return (
    <div>
      { (
        <VStack mt={4} alignItems="flex-start">
          {allNotes.length === 0 && (
            <Text
              textAlign={"center"}
              width="100%"
              color={textColor}
              fontSize="sm"
              fontWeight="700"
            >
              <DataNotFound />
            </Text>
          )}
          {allNotes.length > 0 && (
            <Grid
              width={"100%"}
              templateColumns="repeat(12, 1fr)"
              gap={4}
              mb={2}
            >
              {allNotes.map((note) => {
                return (
                  <GridItem colSpan={{ base: 12, md: 12, lg: 12 }}>
                    <Box
                      backgroundColor={"whitesmoke"}
                      borderRadius={"10px"}
                      width={"100%"}
                      p={4}
                      m={1}
                      height={"100%"}
                    >
                      <Box
                      color={"black"}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Text fontStyle={"italic"}>
                          {note.by}
                        </Text>
                        {/* <Text fontSize={13}>
                          {new Date(note.createdAt).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })}
                        </Text> */}
                      </Box>

                      <Text color={"black"} fontWeight={"bold"} mt={3}>
                        <pre>{note.note}</pre>
                      </Text>
                    </Box>
                  </GridItem>
                );
              })}
            </Grid>
          )}
        </VStack>
      )}
    </div>
  );
};

export default LeadNotes;
