import { Box, CircularProgress, Select, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putApi } from "services/api";
import axios from "axios";
import { constant } from "constant";
const RenderManager = ({ value, leadID, fetchData, pageIndex, setData }) => {
  const [ManagerSelected, setManagerSelected] = useState("");
  const tree = useSelector((state) => state.user.tree);
  const [loading, setLoading] = useState(false);

  const handleChangeManager = async (e) => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log(user?._id,e?.target?.value,"ids ")
    if(user._id == e.target.value){
      // alert("The manager is wroking")
    //  const res= await postApi("api/adminApproval/add", {leadId: leadID, managerId: e.target.value,},true);
    //    console.log(res.data)


    try{
      const res = await axios.post(constant["baseUrl"]+"api/adminApproval/add",{
        leadId: leadID, managerId: e.target.value
      },{
        headers:{
          Authorization:  (localStorage.getItem("token") || sessionStorage.getItem("token"))
        }
      })
      console.log(res.data)
      fetchData()

    }catch(error){
      console.log(error,"error")
    }
    } else{
    try {
      setLoading(true);
      const dataObj = {
        managerAssigned: e.target.value,
      }; 

      if (e.target.value === "") {
        dataObj["agentAssigned"] = "";
      }

      await putApi(`api/lead/edit/${leadID}`, dataObj);
      toast.success("Manager updated successfuly");
      // setManagerSelected(dataObj.managerAssigned || "");
      setData(prevData => {
        const newData = [...prevData]; 

        const updateIdx = newData.findIndex((l) => l._id.toString() === leadID); 
        if(updateIdx !== -1) {
          newData[updateIdx].managerAssigned = dataObj.managerAssigned; 
          newData[updateIdx].agentAssigned = ""; 
        }
        return newData; 
      })
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the manager");
    }
    setLoading(false);
  }
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
