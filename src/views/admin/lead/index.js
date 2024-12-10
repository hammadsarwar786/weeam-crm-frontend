import {
  Button,
  CircularProgress,
  Flex,
  Grid,
  GridItem,
  keyframes,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";
import CheckTable from "./components/CheckTable";
import { postApi } from "services/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Index = () => {
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [displayAdvSearchData,setDisplayAdvSearchData] = useState(false)
  const [searchedData, setSearchedData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [totalLeads, setTotalLeads] = useState(0);
  const [pages, setPages] = useState(0);
  const tree = useSelector((state) => state.user.tree);

  const [permission, emailAccess, callAccess] = HasAccess([
    "Lead",
    "Email",
    "Call",
  ]);
  const tableColumns = [
    { Header: "#", accessor: "intID", isSortable: false, width: 10 },
    { Header: "Name", accessor: "leadName", width: 20 },
    { Header: "Manager", accessor: "managerAssigned" },
    { Header: "Agent", accessor: "agentAssigned" },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Whatsapp Number", accessor: "leadWhatsappNumber" },
    { Header: "Phone Number", accessor: "leadPhoneNumber" },
    { Header: "Date And Time", accessor: "createdDate", width: 40 },
    { Header: "Timetocall", accessor: "timetocall" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Last Note", width: 100, accessor: "lastNote" },
    { Header: "IP", accessor: "ip" },
    { Header: "Lead Address", accessor: "leadAddress" },
    { Header: "Lead Campaign", accessor: "leadCampaign" },
    { Header: "Source Content", accessor: "leadSourceDetails" },
    { Header: "Lead Email", accessor: "leadEmail" },
    { Header: "Lead Medium", accessor: "leadSourceMedium" },
    { Header: "Campaign Page URL", accessor: "pageUrl" },
    { Header: "Are you in UAE?", accessor: "r_u_in_uae" },
    { Header: "Action", isSortable: false, center: true },
  ];
  const tableColumnsManager = [
    { Header: "#", accessor: "intID", isSortable: false, width: 10 },
    { Header: "Name", accessor: "leadName", width: 20 },
    { Header: "Agent", accessor: "agentAssigned" },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Whatsapp Number", accessor: "leadWhatsappNumber" },
    { Header: "Phone Number", accessor: "leadPhoneNumber" },
    { Header: "Date And Time", accessor: "createdDate" },
    { Header: "Timetocall", accessor: "timetocall" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Action", isSortable: false, center: true },
  ];
  const tableColumnsAgent = [
    { Header: "#", accessor: "intID", isSortable: false, width: 10 },
    { Header: "Name", accessor: "leadName", width: 20 },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Whatsapp Number", accessor: "leadWhatsappNumber" },
    { Header: "Phone Number", accessor: "leadPhoneNumber" },
    { Header: "Date And Time", accessor: "createdDate" },
    { Header: "Timetocall", accessor: "timetocall" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Action", isSortable: false, center: true },
  ];

  const roleColumns = {
    Manager: tableColumnsManager,
    Agent: tableColumnsAgent,
  };

  const role = user?.roles[0]?.roleName;

  const [dynamicColumns, setDynamicColumns] = useState(
    roleColumns[role] || tableColumns
  );

  const hiddenFields = JSON.parse(localStorage.getItem("hiddenCols") || "[]"); 
  const [selectedColumns, setSelectedColumns] = useState(
    roleColumns[role] || tableColumns.filter((c) => hiddenFields.includes(c.accessor) === false)
  );
  const [action, setAction] = useState(false);
  const [dateTime, setDateTime] = useState({
    from: "",
    to: "",
  });
  const [autoAssignLoading, setAutoAssignLoading] = useState(false);
  const [columns, setColumns] = useState(roleColumns[role] || tableColumns);
  const { isOpen } = useDisclosure();

  const dataColumn = dynamicColumns?.filter((item) =>
    selectedColumns?.find((colum) => colum?.Header === item.Header)
  );
  const fetchData = async (pageNo = 1, pageSize = 200) => {
    setIsLoding(true);
    let result = await getApi(
      user.role === "superAdmin"
        ? "api/lead/" +
              "?dateTime=" +
              dateTime?.from +
              "|" +
              dateTime?.to +
              "&page=" +
              pageNo +
              "&pageSize=" +
              pageSize
        : `api/lead/?user=${user._id}&role=${
            user.roles[0]?.roleName
          }&dateTime=${
            dateTime?.from + "|" + dateTime?.to
          }&page=${pageNo}&pageSize=${pageSize}`
    );
   const newData =  result.data?.result?.map((lead)=>{
       if(lead?.ip){
        const parts = lead?.ip.split('-');
         
    // Return only the IP part, which is the first element of the array
      lead.ip = parts?.length>1?parts[1]:parts[0];
      
       }
       return {...lead}
    })
    setData(newData || []);
    setPages(result.data?.totalPages || 0);
    setTotalLeads(result.data?.totalLeads || 0);
    setIsLoding(false);
  };

  const fetchSearchedData = async (term = "", pageNo = 1, pageSize = 200) => {
    setIsLoding(true);
    let result = await getApi(
      user.role === "superAdmin"
        ? "api/lead/search" +
            "?term=" +
            term +
            "&dateTime=" +
            dateTime?.from +
            "|" +
            dateTime?.to +
            "&page=" +
            pageNo +
            "&pageSize=" +
            pageSize
        : `api/lead/search?term=${term}&user=${user._id}&role=${
            user.roles[0]?.roleName
          }&dateTime=${
            dateTime?.from + "|" + dateTime?.to
          }&page=${pageNo}&pageSize=${pageSize}`
    );
    setDisplaySearchData(true);
    const newData =  result.data?.result?.map((lead)=>{
      if(lead?.ip){
       const parts = lead?.ip.split('-');
        
   // Return only the IP part, which is the first element of the array
     lead.ip = parts?.length>0?parts[1]:parts[0];
      }
     return {...lead}

   })
    setSearchedData(newData || []);
    setPages(result.data?.totalPages || 0);
    setTotalLeads(result.data?.totalLeads || 0);
    setIsLoding(false);
  };

  const fetchAdvancedSearch = async (data = {}, pageNo = 1, pageSize = 200) => {
    setIsLoding(true);
    let result = await getApi(
      user.role === "superAdmin"
        ? "api/lead/advanced-search" +
            "?data=" +
            JSON.stringify(data) +
            "&dateTime=" +
            dateTime?.from +
            "|" +
            dateTime?.to +
            "&page=" +
            pageNo +
            "&pageSize=" +
            pageSize
        : `api/lead/advanced-search?data=${JSON.stringify(data)}&user=${
            user._id
          }&role=${user.roles[0]?.roleName}&dateTime=${
            dateTime?.from + "|" + dateTime?.to
          }&page=${pageNo}&pageSize=${pageSize}`
    );
    setDisplayAdvSearchData(true);
    setIsLoding(false);
    const newData =  result.data?.result?.map((lead)=>{
      if(lead?.ip){
       const parts = lead?.ip.split('-');
        
   // Return only the IP part, which is the first element of the array
     lead.ip = parts?.length>0?parts[1]:parts[0];
      }
     return {...lead}

   })
    setSearchedData(newData || []);
    setPages(result.data?.totalPages || 0);
    setTotalLeads(result.data?.totalLeads || 0);
  };

  const autoAssign = async () => {
    try {
      setAutoAssignLoading(true);
      let agents = [];

      if (tree && tree["managers"]) {
        agents = tree["agents"]["manager-" + user?._id?.toString()];
      }
      await postApi("api/user/autoAssign", { agents });
      setAutoAssignLoading(false);
      toast.success("Auto assignment of agents done!");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    setColumns(tableColumns);
  }, [action]);

  return (
    <div>
      <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
        <GridItem colSpan={6}>
          {role === "Manager" && (
            <Flex justifyContent={"flex-end"} mb={4}>
              <Button
                onClick={autoAssign}
                bg={"black"}
                disabled={autoAssignLoading}
                rounded={"full"}
                colorScheme={"white"}
              >
                {autoAssignLoading ? "Assigning.." : "Auto Assign"}
              </Button>
            </Flex>
          )}
          <CheckTable
            dateTime={dateTime}
            setDateTime={setDateTime}
            totalLeads={totalLeads}
            isLoding={isLoding}
            setIsLoding={setIsLoding}
            pages={pages}
            columnsData={roleColumns[role] || tableColumns}
            isOpen={isOpen}
            setAction={setAction}
            dataColumn={dataColumn}
            action={action}
            fetchSearchedData={fetchSearchedData}
            setSearchedData={setSearchedData}
            allData={(displaySearchData || displayAdvSearchData) ? searchedData : data}
            setData={setData}
            tableData={(displaySearchData || displayAdvSearchData) ? searchedData : data}
            fetchData={fetchData}
            displaySearchData={displaySearchData}
            setDisplaySearchData={setDisplaySearchData}
            displayAdvSearchData={displayAdvSearchData}
            setDisplayAdvSearchData={setDisplayAdvSearchData}
            setDynamicColumns={setDynamicColumns}
            dynamicColumns={dynamicColumns}
            fetchAdvancedSearch={fetchAdvancedSearch}
            selectedColumns={selectedColumns}
            access={permission}
            setSelectedColumns={setSelectedColumns}
            emailAccess={emailAccess}
            callAccess={callAccess}
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default Index;
