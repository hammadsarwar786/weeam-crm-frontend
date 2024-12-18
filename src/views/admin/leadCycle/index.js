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
  constructor(type, updatedAt, updatedBy, updatedData) {
    this.type = type;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.updatedData = updatedData;
  }
}

const LeadCycle = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const [leadName, setLeadName] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      const data = await getApi(`api/lead/cycle/${params?.lid}`);
      const response = data?.data;
      setLeadName(response.lead.leadName);

      const timelineData = [];
      let createdByName = "Unknown";
      if (response.lead?.createBy?.firstName) {
        createdByName =
          response.lead.createBy.firstName +
          " " +
          response.lead.createBy.lastName;
      }
      const leadCreatedItem = new TimelineItem(
        "creation",
        new Date(response.lead.createdDate)?.toUTCString(),
        createdByName,
        ""
      );
      timelineData.push(leadCreatedItem);
      if (response?.data?.length) {
        response?.data?.forEach((updated) => {
          const newCallItem = new TimelineItem(
            updated.type,
            updated.updatedAt,
            updated.updatedBy?.firstName + " " + updated.updatedBy?.lastName,
            updated.updatedData
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
    if (user && user?._id) {
      fetchData();
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
              Lead Cycle for <small>{leadName}</small>
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

export default LeadCycle;
