import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderEStatus = ({ id, cellValue, setUpdatedEStatus }) => {
	const [value, setValue] = useState("");

	const setStatusData = async (e) => {
		try {
			const data = {
				eLeadStatus: e.target.value,
			};
			let response = await putApi(`api/lead/update/e-status/${id}`, data);
			if (response.status === 200) {
				setValue(data.eLeadStatus);
				setUpdatedEStatus((prev) => [
					...prev,
					{
						id,
						status: data?.eLeadStatus || null,
					},
				]);
				toast.success("Extra Lead Status Updated!");
			}
		} catch (e) {
			console.log(e);
			toast.error("Something went wrong!");
		} finally {
		}
	};

	useEffect(() => {
		setValue(cellValue || "new");
	}, [id]);

	return (
		<>
			<Select
				defaultValue={"null"}
				onChange={setStatusData}
				height={7}
				width={130}
				value={value || ""}
				style={{
					fontSize: "14px",
					backgroundColor: "#ecfeff",
					color: "#0891b2",
					border: "1px solid #0891b2",
					padding: "4px 8px",
				}}
				placeholder="Choose E.Status"
			>
				{/* <option value="null">Choose E.Status</option> */}
				<option value="interested">Interested</option>
				<option value="junk">Junk</option>
				<option value="not-interested">Not interested</option>
				<option value="qualified">Qualified</option>
			</Select>
		</>
	);
};

export default RenderEStatus;
