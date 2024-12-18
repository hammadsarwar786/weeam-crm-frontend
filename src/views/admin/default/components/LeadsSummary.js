import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import { useEffect, useState } from "react";
import { getApi } from "services/api";

const LeadsSummary = ({ user, dateTime }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchLeads = async () => {
    setLoading(true); 
    let lead;
    if (user.role === "superAdmin") {
      lead = await getApi("api/lead");
    } else {
      lead = await getApi(
        `api/lead/?role=${user?.roles[0]?.roleName}&user=${user._id}&dateTime=${
          dateTime?.from + "|" + dateTime?.to
        }`
      );
    }

    const leadData = lead.data?.result || [];
    setData({
      "Total Leads": {
        count: leadData?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
      "Interested Leads": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "active")?.length ||
          0,
        primary: "#eaf9e6",
        secondary: "#43882f",
      },
      "Not-Interested Leads": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "pending")?.length ||
          0,
        primary: "#fbf4dd",
        secondary: "#a37f08",
      },

       "Reassigned": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "reassigned")?.length ||
          0,
        primary: "#ffeeeb",
        secondary: "#d6401d",
      },
      "Sold Leads": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "sold")?.length || 0,
        primary: "#ffeeeb",
        secondary: "#d6401d",
      },
      "New Leads": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "new")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
      Unreachable: {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "unreachable")
            ?.length || 0,
        primary: "#ffeeeb",
        secondary: "#d6401d",
      },
      "No Answer": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "no_answer")
            ?.length || 0,
        primary: "#ffeeeb",
        secondary: "#d6401d",
      },
        "Waiting": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "waiting")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
        "Follow Up": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "follow_up")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
        "Meeting": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "meeting")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },

        "Follow Up After Meeting": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "follow_up_after_meeting")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
        "Deal": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "deal")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
        "Junk": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "junk")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },

        "Whatsapp Send": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "whatsapp_send")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
        "Whataspp Rec": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "whatsapp_rec")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
        "Deal Out": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "deal_out")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
        "Shift Project": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "shift_project")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
        "Wrong Number": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "wrong_number")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },

        "Broker": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "broker")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },

        "Voice mail": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "voice_mail")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },

        "Request": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "request")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [dateTime]);

  return (
    <>
      <div
        style={{
          padding: 20,
        }}
      >
        {loading ? (
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            width="100%"
            height={"100%"}
          >
            <Spinner />
          </Flex>
        ) : (
          <Grid templateColumns="repeat(12, 1fr)" gap={2}>
            {Object.keys(data)?.map((key) => (
              <GridItem colSpan={{ base: 2 }}>
                <Box
                  backgroundColor={data[key]["primary"]}
                  borderRadius={"10px"}
                  p={2}
                  m={1}
                  textAlign={"center"}
                >
                  <Heading size="sm" pb={3} color={data[key]["secondary"]}>
                    {key}
                  </Heading>
                  <Text fontWeight={600} color={data[key]["secondary"]}>
                    <CountUpComponent targetNumber={data[key]["count"] || 0} />{" "}
                  </Text>
                </Box>
              </GridItem>
            ))}
          </Grid>
        )}
      </div>
    </>
  );
};

export default LeadsSummary;
