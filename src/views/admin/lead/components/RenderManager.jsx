import { Box, CircularProgress, Select, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderManager = ({ value, leadID, fetchData, pageIndex, displaySearchData, setSearchedData, setData }) => {
  const [ManagerSelected, setManagerSelected] = useState("");
  const tree = useSelector((state) => state.user.tree);
  const [loading, setLoading] = useState(false);

  const handleChangeManager = async (e) => {
    try {
      setLoading(true);
      const value = e.target.value; 
      const dataObj = {
        managerAssigned: value,
        leadStatus: "reassigned"
      };

      if (e.target.value === "") {
        dataObj["agentAssigned"] = "";
      }

      await putApi(`api/lead/edit/${leadID}`, dataObj);
      toast.success("Manager updated successfuly");
      // setManagerSelected(dataObj.managerAssigned || "");

      if(displaySearchData) {

      setSearchedData(prevData => {
        const newData = [...prevData]; 
        const updateIdx = newData.findIndex((l) => l._id.toString() === leadID); 
        if(updateIdx !== -1) {
          newData[updateIdx].managerAssigned = dataObj.managerAssigned; 
          newData[updateIdx].agentAssigned = ""; 
        }
        return newData; 
      })
      } else {
      setData(prevData => {
        const newData = [...prevData]; 
        const updateIdx = newData.findIndex((l) => l._id.toString() === leadID); 
        if(updateIdx !== -1) {
          newData[updateIdx].managerAssigned = dataObj.managerAssigned; 
          newData[updateIdx].agentAssigned = ""; 
        }
        return newData; 
      })
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the manager");
    }
    setLoading(false);
  };

  useEffect(() => {
    setManagerSelected(value);
  }, [value]);

    const textColor = useColorModeValue("black", "white");


  return loading ? (
    <Box border={"1px solid #eee"} borderRadius={"4px"} padding={"3"} display={"flex"} alignItems={"center"}>
      <p style={{ marginRight: 8 }}>Updating</p>{" "}
      <CircularProgress size={4} isIndeterminate />
    </Box>
  ) : (
    <Select
      style={{
        color: !ManagerSelected ? "grey" : textColor,
      }}
      value={ManagerSelected || ""}
      onChange={handleChangeManager}
      placeholder="No Manager"
    >
      {tree &&
        tree?.managers?.map((manager) => (
          <option
            key={manager?._id?.toString()}
            value={manager?._id?.toString()}
          >
            {manager?.firstName + " " + manager?.lastName}
          </option>
        ))}
    </Select>
  );
};

export default RenderManager;
