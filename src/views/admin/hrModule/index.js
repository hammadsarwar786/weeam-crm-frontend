import {  FaBriefcase } from 'react-icons/fa';
import {  MdGroups } from 'react-icons/md';
import { Grid, GridItem, useDisclosure ,Box,SimpleGrid,Icon,Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";
import CheckTable from "./components/CheckTable";
import { useSelector } from "react-redux";
import { BsShieldCheck } from 'react-icons/bs';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { FiCode } from 'react-icons/fi';

const Index = () => {
  const [employeeManagment,setEmployeeManagment]=useState(false);

  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const tree = useSelector((state) => state.user.tree);

  const [permission, emailAccess, callAccess] = HasAccess([
    "Lead",
    "Email",
    "Call",
  ]);

  const tableColumns = [
    
    { Header: "#", isSortable: false, width: 10 },
    { Header: "Employee Id", accessor: "_id", isSortable: false, width: 10 },
    { Header: "First Name", accessor: "leadName", width: 30 },
    { Header: "Last Name", accessor: "managerAssigned", width: 30 },
    { Header: "DOB", accessor: "agentAssigned", width: 30 },
    { Header: "Gender", accessor: "deleted", width: 30 },
    { Header: "Contact No", accessor: "leadPhoneNumber", width: 30 },
    { Header: "E-mail Address", accessor: "leadEmail", width: 30 },
    { Header: "Address", accessor: "leadAddress", width: 30 },
    { Header: "Department", accessor: "leadSourceDetails", width: 30 },
    { Header: "Position", accessor: "leadSourceMedium", width: 30 },
    { Header: "Hire Date", accessor: "createdDate", width: 30 },
    { Header: "Employment Type", accessor: "nationality", width: 30 },
    { Header: "Status", accessor: "interest", width: 30 },
    { Header: "User ID", accessor: "timetocall", width: 30 },
    { Header: "Next of Kin", accessor: "adset", width: 30 },
    { Header: "Next of Kin Contact No", accessor: "updatedDate", width: 30 },
    { Header: "Action", isSortable: false, center: true },
  ];

  const tableColumnsManager = [
    { Header: "#", isSortable: false, width: 10 },
    { Header: "Employee Id", accessor: "_id", isSortable: false, width: 10 },
    { Header: "First Name", accessor: "leadName", width: 30 },
    { Header: "Last Name", accessor: "managerAssigned", width: 30 },
    { Header: "DOB", accessor: "agentAssigned", width: 30 },
    { Header: "Gender", accessor: "deleted", width: 30 },
    { Header: "Contact No", accessor: "leadPhoneNumber", width: 30 },
    { Header: "E-mail Address", accessor: "leadEmail", width: 30 },
    { Header: "Address", accessor: "leadAddress", width: 30 },
    { Header: "Department", accessor: "leadSourceDetails", width: 30 },
    { Header: "Position", accessor: "leadSourceMedium", width: 30 },
    { Header: "Hire Date", accessor: "createdDate", width: 30 },
    { Header: "Employment Type", accessor: "nationality", width: 30 },
    { Header: "Status", accessor: "interest", width: 30 },
    { Header: "User ID", accessor: "timetocall", width: 30 },
    { Header: "Next of Kin", accessor: "adset", width: 30 },
    { Header: "Next of Kin Contact No", accessor: "updatedDate", width: 30 },
    { Header: "Action", isSortable: false, center: true },
];
const tableColumnsAgent = [
  { Header: "#", isSortable: false, width: 10 },
  { Header: "Employee Id", accessor: "_id", isSortable: false, width: 10 },
  { Header: "First Name", accessor: "leadName", width: 30 },
  { Header: "Last Name", accessor: "managerAssigned", width: 30 },
  { Header: "DOB", accessor: "agentAssigned", width: 30 },
  { Header: "Gender", accessor: "deleted", width: 30 },
  { Header: "Contact No", accessor: "leadPhoneNumber", width: 30 },
  { Header: "E-mail Address", accessor: "leadEmail", width: 30 },
  { Header: "Address", accessor: "leadAddress", width: 30 },
  { Header: "Department", accessor: "leadSourceDetails", width: 30 },
  { Header: "Position", accessor: "leadSourceMedium", width: 30 },
  { Header: "Hire Date", accessor: "createdDate", width: 30 },
  { Header: "Employment Type", accessor: "nationality", width: 30 },
  { Header: "Status", accessor: "interest", width: 30 },
  { Header: "User ID", accessor: "timetocall", width: 30 },
  { Header: "Next of Kin", accessor: "adset", width: 30 },
  { Header: "Next of Kin Contact No", accessor: "updatedDate", width: 30 },
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
  const [selectedColumns, setSelectedColumns] = useState(
    roleColumns[role] || tableColumns
  );
  const [action, setAction] = useState(false);
  const [dateTime, setDateTime] = useState({
    from: "",
    to: "",
  });
  const [columns, setColumns] = useState(roleColumns[role] || tableColumns);
  const { isOpen } = useDisclosure();

  const dataColumn = dynamicColumns?.filter((item) =>
    selectedColumns?.find((colum) => colum?.Header === item.Header)
  );

  const fetchData = async () => {
    setIsLoding(true);
    let result = await getApi(
      user.role === "superAdmin"
        ? "api/invoices/"
        : `api/invoices/?user=${user._id}`, null, "server2"
    );
    setData(result.data?.invoice_items || []);
    setIsLoding(false);
  };

  useEffect(() => {
    setColumns(tableColumns);
  }, [action]);

  const handelBoxClick = ()=> {
    setEmployeeManagment(true)
    console.log(employeeManagment)
  }
  return (
    <>
    {
      employeeManagment ? (
      
        <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
        <GridItem colSpan={6}>

          <CheckTable
            dateTime={dateTime}
            setDateTime={setDateTime}
            isLoding={isLoding}
            setIsLoding={setIsLoding}
            columnsData={roleColumns[role] || tableColumns}
            isOpen={isOpen}
            setAction={setAction}
            dataColumn={dataColumn}
            action={action}
            setSearchedData={setSearchedData}
            allData={data}
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
          />
        </GridItem>
      </Grid>
    ): (
        
      <Box p={5}>
      <SimpleGrid columns={{ sm: 2, md: 3, lg: 5 }} spacing={10}>
      <Box
            onClick={handelBoxClick}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            p={5}
            textAlign="center"
            _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
            transition="all 0.2s ease-in-out"
          >
            <Icon  as={MdGroups} boxSize={8} color="#B79045" mb={4} />
            <Text fontWeight="bold" fontSize="lg">
              Employee Management
            </Text>
          </Box>
      <Box
            
            bg="white"
            boxShadow="md"
            borderRadius="md"
            p={5}
            textAlign="center"
            _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
            transition="all 0.2s ease-in-out"
          >
            <Icon  as={FaBriefcase} boxSize={8} color="#B79045" mb={4} />
            <Text fontWeight="bold" fontSize="lg">
              Payroll Management
            </Text>
          </Box>
      <Box
            
            bg="white"
            boxShadow="md"
            borderRadius="md"
            p={5}
            textAlign="center"
            _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
            transition="all 0.2s ease-in-out"
          >
            <Icon backgroundColor="#B79045" borderRadius="full"   as={FiCode} boxSize={8} color="white" p={1} mb={4} />
            <Text fontWeight="bold" fontSize="lg">
              Attendance Management
            </Text>
          </Box>
      <Box
            
            bg="white"
            boxShadow="md"
            borderRadius="md"
            p={5}
            textAlign="center"
            _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
            transition="all 0.2s ease-in-out"
          >
            <Icon  as={HiOutlineDocumentText} boxSize={8} color="#B79045" mb={4} />
            <Text fontWeight="bold" fontSize="lg">
              Performance Management
            </Text>
          </Box>
      <Box
            
            bg="white"
            boxShadow="md"
            borderRadius="md"
            p={5}
            textAlign="center"
            _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
            transition="all 0.2s ease-in-out"
          >
            <Icon  as={BsShieldCheck} boxSize={8} color="#B79045" mb={4} />
            <Text fontWeight="bold" fontSize="lg">
              Leave Management
            </Text>
          </Box>
      </SimpleGrid>
    </Box>
      )
    }
</>    
  );
};

export default Index;
