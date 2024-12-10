import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderStatus = ({ id, cellValue, setUpdatedStatuses }) => {
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
        toast.success("Lead Status Updated!")
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    } finally {
    }
  };

  const changeStatus = (value) => {
    switch (value) {
      case "pending":
        return "pending";
      case "active":
        return "completed";
      case "sold":
        return "onHold";
      default:
        return "completed";
    }
  };

  useEffect(() => {
    setValue(cellValue || "new");
  }, [id]);

  return (
    <>
      <Select
        defaultValue={"new"}
        className={changeStatus(value)}
        onChange={setStatusData}
        height={7}
        width={130}
        value={value || "new"}
        style={{ fontSize: "14px" }}
      >
        <option value="active">Interested</option>
        <option value="sold">Sold</option>
        <option value="pending">Not interested</option>
        <option value="reassigned">Reassigned</option>
        <option value="new">New</option>
        <option value="no_answer">No Answer</option>
        <option value="unreachable">Unreachable</option>

          <option value="waiting">Waiting</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="meeting">Meeting</option>
                  <option value="follow_up_after_meeting">Follow Up After Meeting</option>
                  <option value="deal">Deal</option>
                  <option value="junk">Junk</option>
                  <option value="whatsapp_send">Whatsapp Send</option>
                  <option value="whatsapp_rec">Whatsapp Rec</option>
                  <option value="deal_out">Deal Out</option>
                  <option value="shift_project">Shift Project</option>
                  <option value="wrong_number">Wrong Number</option>
                  <option value="broker">Broker</option>
                  <option value="voice_mail">Voice Mail</option>
                  <option value="request">Request</option>
      </Select>
    </>
  );
};

export default RenderStatus;
