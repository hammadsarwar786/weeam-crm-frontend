import {
  Button,
  CircularProgress,
  Flex,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";
import CheckTable from "./components/CheckTable";
import { postApi } from "services/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { constant } from "constant";
const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.roles[0]?.roleName;
  const [tableColumns,setTableColumns] = useState([
    { Header: "Username", accessor: "userName", width: 20 },
    { Header: "Email", accessor: "managerAssigned" },
    { Header: "Role", accessor: "role" },
    { Header: "Total Coins", accessor: "coins" },
    { Header: "Request Notes", accessor: "requestNotes" },
    { Header: "Coins Approval", accessor: "" },
    

  ])
  const [tableColumnsManager,setTableColumnsManager] = useState([
    // { Header: "Username", accessor: "username", width: 20 },
    // { Header: "Email", accessor: "managerAssigned" },
    // { Header: "Role", accessor: "role" },
    // { Header: "Total Points", accessor: "leadStatus" },
    // { Header: "Request for the points", accessor: "leadWhatsappNumber" },
    {Header:"Request Date",accessor:"createdAt"},
    { Header: "Request Notes", accessor: "requestNotes" },
    { Header: "Status", accessor: "requestStatus" },

  ]);
  const [ tableColumnsAgent, setTableColumnsAgent] = useState( [
    // { Header: "Username", accessor: "username", width: 20 },
    // { Header: "Email", accessor: "managerAssigned" },
    // { Header: "Role", accessor: "role" },
    // { Header: "Total Points", accessor: "leadStatus" },
    // { Header: "Request for the points", accessor: "leadWhatsappNumber" },
    {Header:"Request Date",accessor:"createdAt"},
    { Header: "Request Notes", accessor: "requestNotes" },
    { Header: "Status", accessor: "requestStatus" },

  ]);
  const roleColumns = {
    Manager: tableColumnsManager,
    Agent: tableColumnsAgent,
  };
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  // 
  const [totalLeads, setTotalLeads] = useState(0); 
  const [pages, setPages] = useState(0); 
  const [approvals,setApprovals] = useState([]);


  const [currentState, setCurrentState]=useState("all_requests")
  const tree = useSelector((state) => state.user.tree);
  
  const [dynamicColumns, setDynamicColumns] = useState(
    roleColumns[role] || tableColumns
  );
  const [selectedColumns, setSelectedColumns] = useState(
    roleColumns[role] || tableColumns
  );
  const [action, setAction] = useState(false);
  const [dateTime, setDateTime] = useState({
    from: "",
    to: "",
  });
  const [autoAssignLoading, setAutoAssignLoading] = useState(false);
  const [columns, setColumns] = useState(roleColumns[role] || tableColumns);
  const { isOpen } = useDisclosure();
  const [permission, emailAccess, callAccess] = HasAccess([
    "Lead",
    "Email",
    "Call",
  ]);
 
  



   useEffect(()=>{

    // if(currentState=="Accepted"){
    //   setTableColumnsManager([
    //     { Header: "Username", accessor: "userName", width: 20 },
    //     { Header: "Email", accessor: "managerAssigned" },
    //     { Header: "Role", accessor: "role" },
    //     { Header: "Total Points", accessor: "leadStatus" },
    //     { Header: "Request for the points", accessor: "leadWhatsappNumber" },
    //     { Header: "Request Notes", accessor: "requestNotes" },
    
    //   ])
    //   setTableColumnsAgent([
    //     { Header: "Username", accessor: "userName", width: 20 },
    //     { Header: "Email", accessor: "managerAssigned" },
    //     { Header: "Role", accessor: "role" },
    //     { Header: "Total Points", accessor: "leadStatus" },
    //     { Header: "Request for the points", accessor: "leadWhatsappNumber" },
    //     { Header: "Request Notes", accessor: "requestNotes" },
    
    //   ])
    // }else{
    //   setTableColumnsManager([
    //     { Header: "Username", accessor: "userName", width: 20 },
    //     { Header: "Email", accessor: "managerAssigned" },
    //     { Header: "Role", accessor: "role" },
    //     { Header: "Total Points", accessor: "leadStatus" },
    //     { Header: "Request for the points", accessor: "leadWhatsappNumber" },
    //     { Header: "Request Notes", accessor: "requestNotes" },
    
    //   ])
    //   setTableColumnsAgent([
    //     { Header: "Username", accessor: "userName", width: 20 },
    //     { Header: "Email", accessor: "managerAssigned" },
    //     { Header: "Role", accessor: "role" },
    //     { Header: "Total Points", accessor: "leadStatus" },
    //     { Header: "Request for the points", accessor: "leadWhatsappNumber" },
    //     { Header: "Request Notes", accessor: "requestNotes" },
    
    //   ])
    // }
fetchData();

   },[currentState])

 

  
useEffect(()=>{
  setDynamicColumns(roleColumns[role] || tableColumns)
  setSelectedColumns(roleColumns[role] || tableColumns)
},[tableColumnsManager])

  const dataColumn = dynamicColumns?.filter((item) =>
    selectedColumns?.find((colum) => colum?.Header === item.Header)
  );

  const fetchData = async (pageNo = 1, pageSize = 10) => {
    setIsLoding(true);
    try {
      //  const res = await getApi("api/adminApproval/get","")
       const result = await axios.get(constant["baseUrl"]+"api/coinsRequest/get",{
        headers:{
          Authorization:  (localStorage.getItem("token") || sessionStorage.getItem("token"))
        },
        params:{
          requestStatus:currentState==="all_requests"?"":currentState,
          page:pageNo,
          pageSize,
          userId:user?.role !== "superAdmin"?user?._id:""
        }
  
       })
      //  setApprovals()
      // console.log(result.data?.approvals,"approvals")
       setData(result.data?.requests || []); 
       setPages(result.data?.totalPages || 0); 
       setTotalLeads(result.data?.totalRequests || 0); 
       setIsLoding(false);
      } catch (error) {
       console.log(error,"error")
      }
    setIsLoding(false);
  };
  const fetchSearchedData = async (term="",pageNo = 1, pageSize = 10) => {
    setIsLoding(true);
    let result = await getApi(
      user.role === "superAdmin"
        ? "api/lead/search" + "?term=" +term + "&dateTime=" + dateTime?.from + "|" + dateTime?.to + "&page=" + pageNo + "&pageSize=" + pageSize
        : `api/lead/search?term=${term}&user=${user._id}&role=${
            user.roles[0]?.roleName
          }&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${pageSize}`
    );
    setDisplaySearchData(true);
    setSearchedData(result.data?.result || []); 
    setPages(result.data?.totalPages || 0); 
    setTotalLeads(result.data?.totalLeads || 0); 
    setIsLoding(false);
  };
  // const autoAssign = async () => {
  //   try {
  //     setAutoAssignLoading(true);
  //     let agents = [];

  //     if (tree && tree["managers"]) {
  //       agents = tree["agents"]["manager-" + user?._id?.toString()];
  //     }
  //     await postApi("api/user/autoAssign", { agents });
  //     setAutoAssignLoading(false);
  //     toast.success("Auto assignment of agents done!");
  //     fetchData();
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong!");
  //   }
  // };
  const checkApproval = (id) =>{
    // console.log("Approval Id", id)
    // console.log("Approvalsss...", approvals)
    return approvals.find(approval=> { 
      // console.log("Approval id ,,", approval?.leadId, id)
      return approval?.leadId == id
     }
    );
  }

  useEffect(() => {
    setColumns(tableColumns);
  }, [action]);
console.log(dynamicColumns,"manager")

async function makeRequest(){
     try{
         const res = await axios.post(`${constant["baseUrl"]}api/coinsRequest/add`,{
          userId:user?._id,
          note:""
         },{
          headers:{
            Authorization:  (localStorage.getItem("token") || sessionStorage.getItem("token"))
          },
          
         })

         fetchData();
     }catch(error){
       console.log(error,"error")
     }
}
  return (
    <div>
      <Button  onClick={()=> setCurrentState("all_requests") } sx={{
        backgroundColor:currentState == "all_requests"&&"#B79045",
        color:currentState == "all_requests"&&"white",
        "_hover":{
        backgroundColor:currentState == "all_requests"&&"#B79045",
        }
      }}>All Requests</Button>
      <Button  onClick={()=> setCurrentState("pending") } 
        sx={{
          backgroundColor:currentState == "pending"&&"#B79045",
        color:currentState == "pending"&&"white",
        "_hover":{
        backgroundColor:currentState == "pending"&&"#B79045",
        }
        }}>Pending</Button>
          <Button onClick={()=> setCurrentState("Approved")} 
            sx={{
              backgroundColor:currentState == "Approved"&&"#B79045",
        color:currentState == "Approved"&&"white",
        "_hover":{
        backgroundColor:currentState == "Approved"&&"#B79045",
        }
            }}>Approved  Requests</Button>
          <Button onClick={()=> setCurrentState("Rejected")}
            sx={{
              backgroundColor:currentState == "Rejected"&&"#B79045",
        color:currentState == "Rejected"&&"white",
        "_hover":{
        backgroundColor:currentState == "Rejected"&&"#B79045",
        }
            }}>Rejected Requests</Button>
      <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
      
        <GridItem colSpan={6}>

          
          <CheckTable
           checkApproval = {checkApproval}
            dateTime={dateTime}
            setDateTime={setDateTime}
            totalLeads={data?.length}
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
            allData={displaySearchData ? searchedData : data}
            setData={setData}
            displaySearchData={displaySearchData}
            tableData={displaySearchData ? searchedData : data}
            fetchData={fetchData}
            setDisplaySearchData={setDisplaySearchData}
            setDynamicColumns={setDynamicColumns}
            dynamicColumns={dynamicColumns}
            selectedColumns={selectedColumns}
            access={permission}
            setSelectedColumns={setSelectedColumns}
            emailAccess={emailAccess}
            callAccess={callAccess}
            makeRequest={makeRequest}
          />
        </GridItem>
      </Grid>
    </div>
  );

};

export default Index;