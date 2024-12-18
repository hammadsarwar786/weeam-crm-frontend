import {
  Button,
  Container,
  Flex,
  Grid,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import { postApi } from "services/api";
import ReportsGrid from "./ReportsGrid";

const CreateDailyReport = () => {
  const [reportSending, setReportSending] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      if(text.trim()) {
        setReportSending(true);
        const response = await postApi("api/dailyReport/add", { text });
        toast.success("Daily report sent to super admin!");
        setText("");
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
    setTimeout(() => {
      setReportSending(false);
    }, 500);
  };

  const fetchData = async () => {
    try {
      setLoading(true); 
      const response = await getApi("api/dailyReport?role=Manager");
      setData(response.data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoading(false); 
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <form action="#" onSubmit={handleSend}>
        <Textarea
          rows={"10"}
          value={text}
          onInput={(e) => setText(e.target.value)}
          required
          resize={"none"}
          placeholder="Write down the daily report.."
        ></Textarea>
        <Flex justifyContent={"end"}>
          <Button
            mt={3}
            type="submit"
            bg={"black"}
            disabled={reportSending}
            rounded={"full"}
            colorScheme={"white"}
          >
            {reportSending ? "Sending..." : "Send Report"}
          </Button>
        </Flex>
      </form>

      <div style={{ marginTop: "50px" }}>
        <Text fontSize={20} mb={5}>
          Today's Reports
        </Text>
        {loading ? <Flex paddingBottom={15} justifyContent={"center"}><Spinner/></Flex> : 
        <ReportsGrid data={data}/> 
        }
      </div>
    </>
  );
};

export default CreateDailyReport;
