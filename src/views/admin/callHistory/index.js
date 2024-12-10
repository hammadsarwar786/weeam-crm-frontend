import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import { useParams } from "react-router-dom";
import Card from "components/card/Card";
import {
  Box,
  CircularProgress,
  Flex,
  Heading,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import LeadHistoryTimeline from "./components/LeadHistoryTimeline";

class TimelineItem {
  constructor(type, dateTime, duration, createdBy, callNotes) {
    this.type = type;
    this.dateTime = dateTime;
    this.duration = duration;
    this.createdBy = createdBy;
    this.callNotes = callNotes; 
  }
}

const CallHistory = () => {
  const params = useParams();
  const textColor = useColorModeValue("gray.500", "white");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")); 

  const fetchData = async (role) => {
    try {
      const data = await getApi(`api/phoneCall/history/${params?.lid}/?role=${role}`);
      const response = data?.data;

      const timelineData = [];
      const leadCreatedItem = new TimelineItem(
        "lead",
        new Date(response.lead.createdAt)?.toUTCString(),
        0,
        response.lead.createdBy
      );
      timelineData.push(leadCreatedItem);
      if (response.calls?.length) {
        response.calls?.forEach((call) => {
          const newCallItem = new TimelineItem(
            "call",
            new Date(call?.timestamp)?.toUTCString(),
            call?.callDuration,
            call?.sender?.firstName + call?.sender?.lastName, 
            call?.callNotes
          );
          timelineData.push(newCallItem);
        });
      }

      setData(timelineData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if(user && user?._id) {
      fetchData(user?.role);
    }
  }, []);

  return (
    <>
      <Card minH={"20em"}>
        {loading ? (
          <Flex justifyContent={"center"} alignItems={"center"} width="100%">
            <Spinner />
          </Flex>
        ) : (
          <div>
            <Heading size="lg" mb={4}>
              Lead History
            </Heading>
            <HSeparator />
            <Box mt={5} pl={10}>
              <LeadHistoryTimeline timelineData={data} />
            </Box>
          </div>
        )}
      </Card>
    </>
  );
};

export default CallHistory;
