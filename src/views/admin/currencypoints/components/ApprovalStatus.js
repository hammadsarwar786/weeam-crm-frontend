import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const ApprovalStatus = ({ id, cellValue, setUpdatedStatuses }) => {
  const [value, setValue] = useState("");

  const setStatusData = async (e) => {
    try {
      const data = {
        leadStatus: e.target.value,
      };
      let response = await putApi(`api/lead/changeStatus/${id}`, data);
      if (response.status === 200) {
        setValue(data.leadStatus);
        setUpdatedStatuses((prev) => [...prev, {
            id, status: data?.leadStatus || "new"
        }])
        toast.success("Approval Status Updated!")
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    } finally {
    }
  };

  const changeStatus = (value) => {
    switch (value) {
      case "accept":
        return "acept";
      case "reject":
        return "reject";
      
      default:
        return "";
    }
  };

  useEffect(() => {
    setValue(cellValue || "new");
  }, [id]);

  return (
    <>
      <Select
        defaultValue={""}
        className={changeStatus(value)}
        onChange={setStatusData}
        height={7}
        width={130}
        value={value || ""}
        style={{ fontSize: "14px" }}
      >
        <option value="accept">Accept</option>
        <option value="reject">Reject</option>
              </Select>
    </>
  );
};

export default ApprovalStatus;
