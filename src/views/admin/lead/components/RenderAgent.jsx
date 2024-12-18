import {
  Box,
  CircularProgress,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderAgent = ({
  value,
  managerAssigned,
  leadID,
  fetchData,
  displaySearchData,
  setSearchedData,
  setData,
}) => {
  const [AgentSelected, setAgentSelected] = useState("");
  const [agents, setAgents] = useState([]);
  const tree = useSelector((state) => state.user.tree);
  const [loading, setLoading] = useState(false);

  const textColor = useColorModeValue("black", "white");

  useEffect(() => {
    if (tree && tree["managers"]) {
      const agentsList = tree?.agents["manager-" + managerAssigned];
      setAgents(agentsList || []);
      setAgentSelected(value);
    }
  }, [managerAssigned, value, tree]);

  const handleChangeAgent = async (e) => {
    try {
      const data = {
        agentAssigned: e.target.value,
        leadStatus: "reassigned",
      };

      setLoading(true);

      await putApi(`api/lead/edit/${leadID}`, data);
      toast.success("Agent updated successfuly");
      // setAgentSelected(data.agentAssigned || "");

      if (displaySearchData) {
        setSearchedData((prevData) => {
          const newData = [...prevData];

          const updateIdx = newData.findIndex(
            (l) => l._id.toString() === leadID
          );
          if (updateIdx !== -1) {
            newData[updateIdx].agentAssigned = data.agentAssigned;
          }
          return newData;
        });
      } else {
        setData((prevData) => {
          const newData = [...prevData];

          const updateIdx = newData.findIndex(
            (l) => l._id.toString() === leadID
          );
          if (updateIdx !== -1) {
            newData[updateIdx].agentAssigned = data.agentAssigned;
          }
          return newData;
        });
      }
      // fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the agent");
    }
    setLoading(false);
  };

  if (agents?.length) {
    return loading ? (
      <Box
        border={"1px solid #eee"}
        borderRadius={"4px"}
        padding={"3"}
        display={"flex"}
        alignItems={"center"}
      >
        <p style={{ marginRight: 8 }}>Updating</p>{" "}
        <CircularProgress size={4} isIndeterminate />
      </Box>
    ) : (
      <Select
        placeholder="No Agent"
        onInput={handleChangeAgent}
        value={AgentSelected === null ? "" : AgentSelected}
        style={{
          color: !AgentSelected ? "grey" : textColor,
        }}
      >
        {agents?.map((agent) => (
          <option key={agent?._id?.toString()} value={agent?._id?.toString()}>
            {agent?.firstName + " " + agent?.lastName}
          </option>
        ))}
      </Select>
    );
  } else {
    return <p style={{ textAlign: "center" }}>No agents</p>;
  }
};

export default RenderAgent;
