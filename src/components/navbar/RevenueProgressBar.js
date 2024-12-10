import { CircularProgress, CircularProgressLabel, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getApi } from "services/api";

const RevenueProgressBar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState({
    totalRevenue: 0,
    target: 0,
  });

  const fetchData = async () => {
    const response = await getApi("api/user/tree");
    const data = response.data;
    if (user.role === "superAdmin") {
      const totalTarget = data["managers"]
        ?.map((manager) => parseFloat(manager?.target))
        ?.reduce((a, b) => a + b, 0);
      const totalRevenue = data["managers"]
        ?.map((manager) => parseFloat(manager?.totalRevenue))
        ?.reduce((a, b) => a + b, 0);
      setData({
        target: totalTarget,
        totalRevenue,
      });
    } else {
      let u = null;
      if (user?.roles[0]?.roleName === "Manager") {
        if (data && data["managers"]) {
          u = data["managers"]?.find(
            (manager) => manager?._id?.toString() === user?._id?.toString()
          );
        }
      } else {
        if (data && data["agents"]) {
          u = data["agents"]["manager-" + user?.parent]?.find(
            (agent) => agent?._id?.toString() === user?._id?.toString()
          );
        }
      }

      setData({
        totalRevenue: u?.totalRevenue || 0,
        target: u?.target || 0,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function formatNumber(num) {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(1) + found.suffix;
    return formatted;
  }

  return num;
}

  return (
    <div>
      <CircularProgress
        size={250}
        value={data.target ? parseInt(100 * (data.totalRevenue / data.target)) : 0}
        color="green.400"
      >
        <CircularProgressLabel>
          {data.target ? parseInt(100 * (data.totalRevenue / data.target)) : 0}%
        </CircularProgressLabel>
      </CircularProgress>

      <Flex alignItems={"center"} textAlign={"center"} justifyContent={"space-around"} mt={3}>
          <div>
            <Text fontWeight={"bold"}>{formatNumber(data.target)}</Text>
            <Text>Target</Text>
          </div>
          
          <div>
            <Text fontWeight={"bold"}>{formatNumber(data.totalRevenue)}</Text>
            <Text>Achieved</Text>
          </div>
      </Flex>
    </div>
  );
};

export default RevenueProgressBar;
