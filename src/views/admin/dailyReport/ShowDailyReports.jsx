import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postApi } from "services/api";
import { useSelector } from "react-redux";
import { Flex, Spinner } from "@chakra-ui/react";
import ReportsGrid from "./ReportsGrid";

const ShowDailyReports = () => {
  const [data, setData] = useState([]);
  const tree = useSelector((state) => state.user.tree);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await postApi("api/dailyReport/all", {
        managers: tree["managers"],
      });
      setData(response.data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tree && tree["managers"]) {
      fetchData();
    }
  }, [tree]);

  if (loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} py={5}>
        <Spinner color="black" />
      </Flex>
    );
  }
  return (
    <>
      {data?.map((report) => {
        return (
          <div>
            <p style={{ marginBottom: 8 }}>
              <strong>{report?.userName}</strong>
            </p>
            <ReportsGrid data={report?.reports} />
          </div>
        );
      })}
    </>
  );
};

export default ShowDailyReports;
