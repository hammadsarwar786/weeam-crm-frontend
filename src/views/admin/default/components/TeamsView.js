import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Icon,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import IconBox from "components/icons/IconBox";
import { useEffect, useState } from "react";
import { LuBuilding2 } from "react-icons/lu";
import { MdAddTask, MdContacts, MdLeaderboard } from "react-icons/md";
import { toast } from "react-toastify";
import MiniStatistics from "components/card/MiniStatistics";
import { postApi } from "services/api";
import { PiPhoneCallBold } from "react-icons/pi";
import { SiGooglemeet } from "react-icons/si";
import { AiOutlineMail } from "react-icons/ai";
import UsersView from "./UsersView";
import LeadsSummary from "./LeadsSummary";
import { getApi } from "services/api";

const TeamsView = ({ dateTime, setDateTime }) => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamSummary, setTeamSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [activePane, setActivePane] = useState("Property");
  const [tree, setTree] = useState({});

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const fetchTeamReport = async () => {
    try {
      setLoading(true);
      const data = await postApi(
        "api/reporting/team?dateTime=" + dateTime?.from + "|" + dateTime?.to,
        tree["agents"]["manager-" + selectedTeam] || []
      );
      setTeamSummary(data?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch teams data");
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
    if (tree && tree["agents"] && selectedTeam) {
      fetchTeamReport();
    }
  }, [selectedTeam, dateTime]);

  const team =
    tree["managers"] &&
    tree["managers"]?.find(
      (manager) => manager?._id?.toString() === selectedTeam
    );
  const teamName = team?.firstName + team?.lastName;

  const panes = {
    Property: (
      <CircularProgress
        size={250}
        value={team?.target ? parseInt(100 * (team?.totalRevenue / team?.target)) : 0}
        color="green.400"
      >
        <CircularProgressLabel>
          {team?.target ? parseInt(100 * (team?.totalRevenue / team?.target)) : 0}%
        </CircularProgressLabel>
      </CircularProgress>
    ),
    Leads: <LeadsSummary dateTime={dateTime} user={team} />,
  };

  return (
    <div>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Select
            disabled={!tree["managers"]}
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            width={"30%"}
            placeholder="Select Team"
          >
            {tree &&
              tree["managers"]?.map((manager) => {
                return (
                  <option
                    key={manager?._id?.toString()}
                    value={manager?._id?.toString()}
                  >
                    {manager?.firstName + " " + manager?.lastName}
                  </option>
                );
              })}
          </Select>

          {selectedTeam && (
            <Flex alignItems={"center"} className="date-range-selector">
              <Flex alignItems={"center"}>
                <p>From:</p>
                <div style={{ width: 10 }}></div>
                <input
                  value={dateTime.from}
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateTime({ ...dateTime, from: e.target.value });
                    } else {
                      setDateTime({ to: "", from: "" });
                    }
                  }}
                  style={{ color: "#422afb" }}
                  type="datetime-local"
                />
              </Flex>
              {dateTime?.from && (
                <div>
                  <Flex ms={10} alignItems={"center"}>
                    <p>To:</p>
                    <div style={{ width: 10 }}></div>
                    <input
                      value={dateTime.to}
                      onChange={(e) => {
                        setDateTime({ ...dateTime, to: e.target.value });
                      }}
                      style={{ color: "#422afb" }}
                      type="datetime-local"
                    />
                  </Flex>
                </div>
              )}
            </Flex>
          )}
        </div>
      </Card>
      {loading ? (
        <div
          style={{
            height: "40vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress ml={2} size={10} isIndeterminate color="black" />
        </div>
      ) : selectedTeam && tree["agents"]["manager-" + selectedTeam]?.length ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 25,
              marginTop: 30,
            }}
          >
            <p style={{ fontSize: 30 }}>
              Team <strong>{teamName}</strong>
            </p>
          </div>

          <div>{panes[activePane]}</div>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            gap="20px"
            mb="20px"
            mt={"20px"}
          >
            <MiniStatistics
              active={activePane === "Property"}
              onClick={() => setActivePane("Property")}
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={LuBuilding2}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Property"
              value={teamSummary["Properties"] || 0}
            />
            <MiniStatistics
              active={activePane === "Leads"}
              onClick={() => setActivePane("Leads")}
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={MdLeaderboard}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Leads"
              value={teamSummary["Leads"] || 0}
            />
            <MiniStatistics
              active={activePane === "Tasks"}
              onClick={() => setActivePane("Tasks")}
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="28px" h="28px" as={MdAddTask} color={brandColor} />
                  }
                />
              }
              name="Tasks"
              value={teamSummary["Tasks"] || 0}
            />
            <MiniStatistics
              active={activePane === "Contacts"}
              onClick={() => setActivePane("Contacts")}
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={MdContacts}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Contacts"
              value={teamSummary["Contacts"] || 0}
            />

            <MiniStatistics
              active={activePane === "Calls"}
              onClick={() => setActivePane("Calls")}
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={PiPhoneCallBold}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Calls"
              value={teamSummary["Calls"] || 0}
            />
            <MiniStatistics
              active={activePane === "Meetings"}
              onClick={() => setActivePane("Meetings")}
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={SiGooglemeet}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Meetings"
              value={teamSummary["Meetings"] || 0}
            />
            <MiniStatistics
              active={activePane === "Emails"}
              onClick={() => setActivePane("Emails")}
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={AiOutlineMail}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Emails"
              value={teamSummary["Emails"] || 0}
            />
          </SimpleGrid>
          <Card>
            <UsersView
              dateTime={dateTime}
              user={tree["managers"]?.find(
                (manager) => manager?._id?.toString() === selectedTeam
              )}
            />
          </Card>
        </>
      ) : (
        selectedTeam &&
        tree["agents"]["manager-" + selectedTeam]?.length === 0 && (
          <p
            style={{
              margin: "10px",
              color: "red",
            }}
          >
            This team doesn't have any member
          </p>
        )
      )}
    </div>
  );
};

export default TeamsView;
