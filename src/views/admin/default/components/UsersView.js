import {
  Button,
  CircularProgress,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postApi } from "services/api";
import Chart from "components/charts/LineChart.js";
import LeadsSummary from "./LeadsSummary";
import UserViewProperties from "./UserViewProperties";
import UserViewLeads from "./UserViewLeads";
import { getApi } from "services/api";

const dataLabels = [
  "Leads",
  "Contacts",
  "Tasks",
  "Properties",
  "Emails",
  "Calls",
  "Meetings",
];

const UsersView = ({
  user = JSON.parse(localStorage.getItem("user")),
  usersData = [],
  dateTime = {from: "", to: ""}
}) => {
  const [activeBtn, setActiveBtn] = useState("Leads");
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([...usersData]);
  const [data, setData] = useState([]);
  const [tree, setTree] = useState({});
  

  const fetchUsersViewData = async () => {
    setLoading(true);
    let result = await postApi(
      `api/user/usersView?role=Manager&module=${activeBtn}&dateTime=${dateTime?.from + "|" + dateTime?.to}`,
      tree["agents"]["manager-" + user?._id?.toString()]
    );
    if (result && result.status === 200) {
      setData(result?.data);
      setLoading(false);
    }
  };

  const fetchTree = async () => {
    const response = await getApi("api/user/tree");
    const data = response.data;
    setTree(data);
  };

  useEffect(() => {
    fetchTree();
  }, []);

  useEffect(() => {
    if (tree && tree["managers"]) {
      fetchUsersViewData();
      setUsersList(tree["agents"]["manager-" + user?._id?.toString()]);
    }
  }, [tree, activeBtn, dateTime]);


  const panes = {
    Properties: <UserViewProperties usersList={usersList} />,
    Leads: <UserViewLeads dateTime={dateTime} usersList={usersList} />,
  };

  return (
    <Card>
      <Heading size="md" pb={3}>
        {user?.role === "superAdmin" ? "Managers View" : "Agents View"}
      </Heading>

      <div className="flex items-center">
        {dataLabels?.map((label) => {
          return (
            <Button
              onClick={() => setActiveBtn(label)}
              colorScheme={activeBtn === label ? "messenger" : "gray"}
            >
              {loading && activeBtn === label ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Loading
                  <CircularProgress
                    ml={2}
                    size={4}
                    isIndeterminate
                    color="black"
                  />
                </div>
              ) : (
                label
              )}
            </Button>
          );
        })}
      </div>

      {panes[activeBtn]}

      <Chart data={data} />
    </Card>
  );
};

export default UsersView;
