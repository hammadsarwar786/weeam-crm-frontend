import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  MenuDivider,
  useColorModeValue,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import * as XLSX from "xlsx";

// Custom components
import {
  DeleteIcon,
  EditIcon,
  EmailIcon,
  PhoneIcon,
  SearchIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaHistory, FaPlus, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getApi } from "services/api";
import Delete from "../Delete";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import Add from "../Add";
import { AddIcon } from "@chakra-ui/icons";
import { CiEdit, CiMenuKebab } from "react-icons/ci";
import Edit from "../Edit";
import { useFormik } from "formik";
import { BsColumnsGap, BsWhatsapp } from "react-icons/bs";
import * as yup from "yup";
import ImportModal from "./ImportModal";
import CustomSearchInput from "components/search/search";
import DataNotFound from "components/notFoundData";
import RenderManager from "./RenderManager";
import RenderAgent from "./RenderAgent";
import RenderStatus from "./RenderStatus";
import ApprovalStatus from "./ApprovalStatus";
import { MdTask } from "react-icons/md";
import AddTask from "./addTask";
import { toast } from "react-toastify";
import { putApi } from "services/api";
import { constant } from "constant";
import AdvancedSearchModal from "./AdvancedSearchModal";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import LeadNotes from "./LeadNotes";
import { HSeparator } from "components/separator/Separator";
import NewNoteModal from "./NewNoteModal";
export default function CheckTable(props) {
  const {
    tableData,
    dataColumn,
    fetchData,
    isLoding,
    allData,
    access,
    setSearchedData,
    setDisplaySearchData,
    displaySearchData,
    selectedColumns,
    setSelectedColumns,
    dynamicColumns,
    callAccess,
    emailAccess,
    setAction,
    action,
    setIsLoding,
    dateTime,
    setDateTime,
    pages,
    totalLeads,
    fetchSearchedData,
    setData,
    checkApproval,makeRequest
  } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [leadData, setLeadData] = useState([]);
  // const columns = useMemo(() => dataColumn, [dataColumn]);
  const columns = dataColumn;
  const [selectedValues, setSelectedValues] = useState([]);
  const [getTagValues, setGetTagValues] = useState([]);
  const [gopageValue, setGopageValue] = useState(1);

  const user = JSON.parse(localStorage.getItem("user"));
  const tree = useSelector((state) => state.user.tree);

  const [deleteModel, setDelete] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [callSelectedId, setCallSelectedId] = useState();
  const navigate = useNavigate();
  let data = useMemo(() => tableData, [tableData]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isTaskOpen,
    onOpen: onTaskOpen,
    onClose: onTaskClose,
  } = useDisclosure();
  const [edit, setEdit] = useState(false);
  const [updatedPage, setUpdatedPage] = useState(0);
  const [isImportLead, setIsImportLead] = useState(false);
  const searchbox = useRef();
  const [column, setColumn] = useState("");
  const [updatedStatuses, setUpdatedStatuses] = useState([]);
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn); // State to track changes
  const [taskInits, setTaskInits] = useState({});
  const [isCoinsModal,setIsCoinsModal] = useState(null)
  const [amount,setAmount] = useState(0)
  const [userCoins,setUserCoins] = useState(0)
  const [newNoteModal,setNewNoteModal] = useState(false)
  const [notesModal,setNotesModal] = useState(false)
  useEffect(()=>{
    setTempSelectedColumns(dataColumn)
  },[dataColumn])
  console.log(dataColumn,"dataColumn")
 

  const csvColumns = [
    { Header: "Name", accessor: "leadName" },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Whatsapp Number", accessor: "leadWhatsappNumber" },
    { Header: "Phone Number", accessor: "leadPhoneNumber" },
    { Header: "Date And Time", accessor: "createdDate" },
    { Header: "Timetocall", accessor: "timetocall" },
  ];

  let isColumnSelected;
  const toggleColumnVisibility = (columnKey) => {
    setColumn(columnKey);
    isColumnSelected = tempSelectedColumns?.some(
      (column) => column?.accessor === columnKey
    );

    if (isColumnSelected) {
      const updatedColumns = tempSelectedColumns?.filter(
        (column) => column?.accessor !== columnKey
      );
      setTempSelectedColumns(updatedColumns);
    } else {
      const columnToAdd = dynamicColumns?.find(
        (column) => column?.accessor === columnKey
      );
      setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
    }
  };

  const handleColumnClear = () => {
    isColumnSelected = selectedColumns?.some(
      (selectedColumn) => selectedColumn?.accessor === column?.accessor
    );
    setTempSelectedColumns(dynamicColumns);
    setManageColumns(!manageColumns ? !manageColumns : false);
  };

  const initialValues = {
    leadName: "",
    leadStatus: "",
    leadEmail: "",
    leadPhoneNumber: "",
    managerAssigned: "",
    agentAssigned: "",
  };
  const validationSchema = yup.object({
    leadName: yup.string(),
    leadStatus: yup.string(),
    leadEmail: yup.string().email("Lead Email is invalid"),
    leadPhoneNumber: yup
      .number()
      .typeError("Enter Number")
      .min(0, "Lead Phone Number is invalid")
      .max(999999999999, "Lead Phone Number is invalid")
      .notRequired(),
    leadAddress: yup.string(),
    agentAssigned: yup.string(),
    leadOwner: yup.string(),
    fromLeadScore: yup.number().min(0, "From Lead Score is invalid"),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoding(true);
      const searchResult = allData?.filter(
        (item) =>
          (!values?.leadName ||
            (item?.leadName &&
              item?.leadName
                ?.toLowerCase()
                ?.includes(values?.leadName?.toLowerCase()))) &&
          (!values?.leadStatus ||
            (values?.leadStatus === "new"
              ? item?.leadStatus === "" || item?.leadStatus === "new"
              : item?.leadStatus
                  ?.toLowerCase()
                  ?.includes(values?.leadStatus?.toLowerCase()))) &&
          (!values?.leadEmail ||
            (item?.leadEmail &&
              item?.leadEmail
                ?.toLowerCase()
                ?.includes(values?.leadEmail?.toLowerCase()))) &&
          (!values?.agentAssigned ||
            (item?.agentAssigned &&
              item?.agentAssigned === values?.agentAssigned)) &&
          (!values?.managerAssigned ||
            (item?.managerAssigned &&
              item?.managerAssigned === values?.managerAssigned)) &&
          (!values?.leadPhoneNumber ||
            (item?.leadPhoneNumber &&
              item?.leadPhoneNumber
                ?.toString()
                ?.includes(values?.leadPhoneNumber)))
      );

      let agent = null;
      if (values?.agentAssigned && user?.roles[0]?.roleName === "Manager") {
        agent = tree["agents"]["manager-" + user?._id?.toString()]?.find(
          (user) => user?._id?.toString() === values?.agentAssigned
        );
      } else if (values?.agentAssigned && values?.managerAssigned) {
        agent = tree["agents"]["manager-" + values.managerAssigned]?.find(
          (user) => user?._id?.toString() === values?.agentAssigned
        );
      }

      let manager = null;
      if (values?.managerAssigned) {
        manager = tree["managers"]?.find(
          (user) => user?._id?.toString() === values?.managerAssigned
        );
      }
      let getValue = [
        values.leadName,
        values.leadStatus === "active"
          ? "interested"
          : values.leadStatus === "pending"
          ? "not-interested"
          : values.leadStatus,
        values?.leadEmail,
        (manager && manager?.firstName + " " + manager?.lastName) || "",
        (agent && agent?.firstName + " " + agent?.lastName) || "",
        values?.leadPhoneNumber,
        values?.leadOwner,
        (![null, undefined, ""].includes(values?.fromLeadScore) &&
          `${values.fromLeadScore}-${values.toLeadScore}`) ||
          undefined,
      ].filter((value) => value);
      setGetTagValues(getValue);
      setUpdatedPage(0);
      setSearchedData(searchResult);
      setDisplaySearchData(true);
      setAdvaceSearch(false);
      setSearchClear(true);
      setIsLoding(false);
      resetForm();
    },
  });
  const handleClear = () => {
    searchbox.current.value = "";
    setDisplaySearchData(false);
    setSearchedData([]);
    setUpdatedPage(0);
    fetchData(1, pageSize);
    setGopageValue(1);
    setUpdatedPage(0); 
  };

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    dirty,
  } = formik;

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      initialState: { pageIndex: updatedPage },
      pageCount: pages,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length);
  }

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };

  const handleClick = () => {
    onOpen();
  };

  const fetchCustomData = async () => {
    const response = await getApi("api/custom-field?moduleName=Lead");
    setLeadData(response.data);
  };

  useEffect(() => {
    if (fetchCustomData) fetchCustomData();
  }, [action]);

  const size = "lg";

  const handleExportLeads = (extension) => {
    if (selectedValues && selectedValues?.length > 0) {
      downloadCsvOrExcel(extension, selectedValues);
    } else {
      downloadCsvOrExcel(extension);
    }
  };

  const downloadCsvOrExcel = async (extension, selectedIds) => {
    try {
      if (selectedIds && selectedIds?.length > 0) {
        const selectedRecordsWithSpecificFileds = tableData
          ?.filter((rec) => selectedIds.includes(rec._id))
          ?.map((rec) => {
            const selectedFieldsData = {};
            csvColumns.forEach((property) => {
              if (
                property.accessor === "leadStatus" &&
                !rec[property.accessor]
              ) {
                selectedFieldsData[property.accessor] = "new";
              } else {
                selectedFieldsData[property.accessor] = rec[property.accessor];
              }
            });
            return selectedFieldsData;
          });

        convertJsonToCsvOrExcel(
          selectedRecordsWithSpecificFileds,
          csvColumns,
          "lead",
          extension
        );
      } else {
        const AllRecordsWithSpecificFileds = tableData?.map((rec) => {
          const selectedFieldsData = {};
          csvColumns.forEach((property) => {
            if (property.accessor === "leadStatus" && !rec[property.accessor]) {
              selectedFieldsData[property.accessor] = "new";
            } else {
              selectedFieldsData[property.accessor] = rec[property.accessor];
            }
          });
          return selectedFieldsData;
        });
        convertJsonToCsvOrExcel(
          AllRecordsWithSpecificFileds,
          csvColumns,
          "lead",
          extension
        );
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(()=>{
    async function fetchUser(){

      const res = await getApi(`api/user/view/${user?._id}`)

      setUserCoins(res?.data?.coins)
    }
    fetchUser();
  },[])

  const approveChangeHandler = async(isApproved,row) =>{
    const user = JSON.parse(localStorage.getItem('user'))
    console.log(user?.role,"role")
    try{
        const res = await axios.put(`${constant["baseUrl"]}api/coinsRequest/update`,{
          userId:row?.userId,
          coins:Number(amount),
          isApproved: isApproved === "accept"?true:false,
          objectId:row?._id
        },{
          headers:{
            Authorization:  (localStorage.getItem("token") || sessionStorage.getItem("token"))
          }
        })
        fetchData();
    }catch(error){
         console.log(error,"error")
    }
  }

  const convertJsonToCsvOrExcel = (
    jsonArray,
    csvColumns,
    fileName,
    extension
  ) => {
    const csvHeader = csvColumns.map((col) => col.Header);

    const csvContent = [
      csvHeader,
      ...jsonArray.map((row) => csvColumns.map((col) => row[col.accessor])),
    ];

    const ws = XLSX.utils.aoa_to_sheet(csvContent);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, `${fileName}.${extension}`); // .csv, .xlsx
    setSelectedValues([]);
  };

  const fetchSearch = () => {
    if(searchbox.current?.value?.trim()) {
      fetchSearchedData(searchbox.current?.value?.trim(), 1, pageSize); 
      setUpdatedPage(0); 
      setGopageValue(1); 
    }
  }

  useEffect(() => {
    setGopageValue(1); 
    setUpdatedPage(0); 
    if(displaySearchData) {
      fetchSearchedData(searchbox.current?.value?.trim()); 
    } else {
      fetchData(); 
    }

  }, [action]);

  useEffect(() => {
    setGopageValue(1); 
    setUpdatedPage(0); 
    if (fetchData && (dateTime.from || dateTime.to) && !displaySearchData) fetchData();
  }, [dateTime]);

  useEffect(() => {
    setUpdatedPage(pageIndex);
    if (displaySearchData) {
      fetchSearchedData(
        searchbox.current?.value?.trim() || "",
        pageIndex + 1,
        pageSize
      );
    } else {
      fetchData(pageIndex + 1, pageSize);
    }
  }, [pageIndex]);

  useEffect(() => {
    setUpdatedPage(0);
    setGopageValue(1); 
    if (displaySearchData) {
      fetchSearchedData(searchbox.current?.value?.trim() || "", 1, pageSize);
    } else {
      fetchData(1, pageSize);
    }
  }, [pageSize]);

  return (
    <>
      <Flex
        p={4}
        alignItems={"center"}
        style={{
          position: "relative",
          fontSize: 15,
        }}
        className="date-range-selector"
      >
        {/* <Flex alignItems={"center"}>
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
        </Flex> */}
        {dateTime?.from && (
          <div>
            <Flex ms={2} alignItems={"center"}>
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

        {(dateTime.from || dateTime.to) && (
          <Button
            colorScheme="red"
            variant="outline"
            ml={3}
            size="sm"
            onClick={() =>
              setDateTime({
                from: "",
                to: "",
              })
            }
          >
            Clear
          </Button>
        )}
      </Flex>
      <Card
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
       {user?.role !== "superAdmin" && <div style={{
        display:"flex",
        justifyContent:'space-between'
       }}>
        <div style={{
          display:"flex",
          alignItems:"center",
          gap:"10px"
        }}>
          <div style={{
            fontSize:"22px",
            color:'#F0A608',

          }}>
            COINS
          </div>
          <div style={{
            fontSize:'22px',
            color:"#F0A608"
          }}>
            {userCoins}
          </div>
        </div>
        
       <Button
        variant="brand"
        sx={{
          width:"fit-content"
        }}
        onClick={makeRequest}
        >
          Make Request for Points
        </Button>
        </div>}
        
      

        <Box overflowY={"auto"} className="table-fix-container">
          <Table
            {...getTableProps()}
            variant="simple"
            color="gray.500"
            mb="24px"
          >
            <Thead zIndex={1}>
              {headerGroups?.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers?.map((column, index) => (
                    <Th
                      {...column.getHeaderProps(
                        column.isSortable !== false &&
                          column.getSortByToggleProps()
                      )}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
                    >
                      <Flex
                        align="center"
                        justifyContent={column.center ? "center" : "start"}
                        fontSize={{ sm: "10px", lg: "12px" }}
                      >
                        {column.Header === "#" && (
                          <Checkbox
                            borderColor={"brand.600"}
                            value={"true"}
                            isChecked={selectAllChecked}
                            onChange={(event) => {
                              setSelectAllChecked(!selectAllChecked);
                              if (event.target.checked) {
                                const ids = page?.map((l) => l?.original?._id);
                                setSelectedValues(() => [...ids]);
                              } else {
                                setSelectedValues([]);
                              }
                            }}
                            me="10px"
                          />
                        )}
                        <span
                          color="secondaryGray.900"
                          style={{
                            textTransform: "capitalize",
                            marginRight: "8px",
                          }}
                        >
                          {column.render("Header")}
                        </span>
                        {column.isSortable !== false && (
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <FaSortDown />
                              ) : (
                                <FaSortUp />
                              )
                            ) : (
                              <FaSort />
                            )}
                          </span>
                        )}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {isLoding ? (
                <Tr>
                  <Td colSpan={columns?.length}>
                    <Flex
                      justifyContent={"center"}
                      alignItems={"center"}
                      width="100%"
                      color={textColor}
                      fontSize="sm"
                      fontWeight="700"
                    >
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
              ) : data?.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Text
                      textAlign={"center"}
                      width="100%"
                      color={textColor}
                      fontSize="sm"
                      fontWeight="700"
                    >
                      <DataNotFound />
                    </Text>
                  </Td>
                </Tr>
              ) : (
                page?.map((row, i) => {
                  prepareRow(row);
                  updatedStatuses?.forEach((status) => {
                    if (status?.id === row?.original?._id) {
                      row.cells.find(
                        (cell) => cell?.column?.Header === "Status"
                      ).value = status?.status;
                    }
                  });

                  return (
                    <Tr {...row?.getRowProps()} key={i} className="leadRow">
                      {row?.cells?.map((cell, index) => {
                        let data = "";
                        if (cell?.column.Header === "#") {
                          data = (
                            <Flex align="center">
                              <Checkbox
                                colorScheme="brandScheme"
                                value={selectedValues}
                                isChecked={selectedValues.includes(
                                  row.original?._id
                                )}
                                onChange={(event) =>
                                  handleCheckboxChange(event, row.original?._id)
                                }
                                me="10px"
                              />
                              <Text
                                color={textColor}
                                fontSize="sm"
                                // fontWeight="500"
                                fontWeight="700"
                              >
                                {cell?.value || "-"}
                              </Text>
                            </Flex>
                          );
                        } else if (cell?.column.Header === "Request Date") {
                        //  console.log(cell?.value?.text,cell?.value,"cell value")
                         data= (
                            
                              <Text
                                me="10px"
                                sx={{
                                  "&:hover": {
                                    color: "blue.500",
                                    textDecoration: "underline",
                                  },
                                }}
                                pl={19}
                                color="brand.600"
                                fontSize="sm"
                                // fontWeight="500"
                                fontWeight="700"
                              >
                                {/* {cell?.value?.text || cell?.value} */}
                                
                                 {new Date(row?.original?.createdAt).toLocaleDateString('en-US', {  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})}

                              </Text>
                          
                          ) 
                        } else if (cell?.column.Header === "Request Notes") {
                          data = (
                           <> <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                              pl={19}
                            >
                              {row?.original?.requestNotes?.length>0?row?.original?.requestNotes[row?.original?.requestNotes?.length-1]?.note:"-"}
                            </Text>
                        
                            <Button
                              onClick={()=>setNotesModal(row?.original?._id)}
                               sx={{
                                padding:"5px",
                                borderRadius:"50%",
                                cursor:"pointer",
                                "hover":{
                                  backgroundColor:'blue',
                                  color:"white"
                                }

                              }}><CiEdit size={18}/></Button>
                              
                           </>
                          );
                        } else if (cell?.column.Header === "Username") {
                          
                          data=(  <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                              pl={19}
                              onClick={() => {
                                setAddPhoneCall(true);
                                setCallSelectedId(row?.original?._id);
                              }}
                            >
                              {cell?.value?.text || cell?.value || "-"}
                            </Text>
                          )
                        } else if (cell?.column.Header === "Address") {
                          data = (
                            <Text
                              color={textColor}
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value?.text || cell?.value || ""}
                            </Text>
                          );
                        } 
                        else if (cell?.column.Header === "Role") {
                          data = (
                            <Text pl={19} className="selectOpt">
                             
                              {cell?.value?.text || cell?.value || ""}
                            </Text>
                          );
                        }else if (cell?.column.Header === "Status") {
                          data = (
                            <Text className="selectOpt" pl={19}>
                              {/* <RenderStatus
                                setUpdatedStatuses={setUpdatedStatuses}
                                id={cell?.row?.original?._id}
                                cellValue={cell?.value}
                              /> */}
                              {cell?.row?.original?.requestStatus}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Coins Approval"){
                          console.log(checkApproval(row?.original?._id),"leadId")
                          data = (
                            // <div className="selectOpt">
                            //   <ApprovalStatus
                            //     setUpdatedStatuses={setUpdatedStatuses}
                            //     id={cell?.row?.original?._id}
                            //     cellValue={cell?.value}
                            //   />
                            // </div>
                            row?.original?.requestStatus != "pending"?row?.original?.requestStatus :
                            <div style={{
                              display:"flex",
                              gap:"10px",
                              paddingLeft:"19px"
                            }}>
                              <Button
                              onClick={()=>setIsCoinsModal(row?.original)}
                               sx={{
                                padding:"5px",
                                borderRadius:"50%",
                                cursor:"pointer",
                                "hover":{
                                  backgroundColor:'blue',
                                  color:"white"
                                }

                              }}><FaCheck size={18}/></Button>
                              <Button 
                              onClick={()=>approveChangeHandler("reject",row?.original)}
                               sx={{
                                padding:"5px",
                                borderRadius:"50%",
                                cursor:"pointer",
                                "hover":{
                                  backgroundColor:'red',
                                  color:"white"
                                }
                                
                              }}><IoMdClose size={18}/></Button>
                            </div>
                          //   <Select
                          //   defaultValue={"None"}
                          //   // className={changeStatus(value)}
                          //   onChange={(e)=>approveChangeHandler(e,row?.original?._id?.toString())}
                          //   height={7}
                          //   width={130}
                          //   style={{ fontSize: "14px" }}
                          // >
                          //   <option value="none">None</option>
                          //   <option value="accept">Accept</option>
                          //   <option value="reject">Reject</option>
                          //         </Select>

                          );
                        }  else if(cell?.column.Header === "Total Coins"){
                            data=(
                              <Text pl={19}>
                                {cell?.value?.text || cell?.value || "-"}
                              </Text>
                            )
                        } else if (cell?.column.Header === "Manager") {
                          data = (
                            <RenderManager
                              fetchData={fetchData}
                              pageIndex={pageIndex}
                              setData={setData}
                              leadID={row?.original?._id?.toString()}
                              value={cell?.value}
                              checkApproval={checkApproval}
                            />
                          );
                        } else if (cell?.column.Header === "Agent") {
                          data = (
                            <>
                              <RenderAgent
                              checkApproval={checkApproval}
                                
                                setData={setData}
                                fetchData={fetchData}
                                leadID={row?.original?._id?.toString()}
                                managerAssigned={row?.original?.managerAssigned}
                                value={cell?.value}
                              />
                            </>
                          );
                        } else if (cell?.column.Header === "Nationality") {
                          data = (
                            <Text
                              color={
                                cell?.value < 40
                                  ? "red.600"
                                  : cell?.value < 80
                                  ? "yellow.400"
                                  : "green.600"
                              }
                              fontSize="md"
                              fontWeight="900"
                              textAlign={"center"}
                            >
                              {cell?.value?.text || cell?.value || "-"}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Timetocall") {
                          data = (
                            <Text
                              color={
                                cell?.value < 40
                                  ? "red.600"
                                  : cell?.value < 80
                                  ? "yellow.400"
                                  : "green.600"
                              }
                              fontSize="md"
                              fontWeight="900"
                              textAlign={"center"}
                            >
                              {cell?.value?.text || cell?.value || "-"}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Date And Time") {
                          data = (
                            <Text
                              fontSize={"sm"}
                              fontWeight="900"
                              textAlign={"center"}
                            >
                              {new Date(cell?.value?.text || cell?.value).toLocaleString() || "-"}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Action") {
                          data = (
                            <Text
                              fontSize="md"
                              fontWeight="900"
                              textAlign={"center"}
                            >
                              <Menu isLazy>
                                <MenuButton>
                                  <CiMenuKebab />
                                </MenuButton>
                                <MenuList
                                  minW={"fit-content"}
                                  transform={"translate(1520px, 173px);"}
                                >
                                  {access?.update && (
                                    <MenuItem
                                      py={2.5}
                                      onClick={() => {
                                        setEdit(true);
                                        setSelectedId(cell?.row?.original._id);
                                      }}
                                      icon={<EditIcon fontSize={15} mb={1} />}
                                    >
                                      Edit
                                    </MenuItem>
                                  )}
                                  
                                  {access?.delete && (
                                    <MenuItem
                                      py={2.5}
                                      color={"red"}
                                      onClick={() => {
                                        setSelectedValues([
                                          cell?.row?.original._id,
                                        ]);
                                        setDelete(true);
                                      }}
                                      icon={<DeleteIcon fontSize={15} mb={1} />}
                                    >
                                      Delete
                                    </MenuItem>
                                  )}
                                </MenuList>
                              </Menu>
                            </Text>
                          );
                        }
                        return (
                          <Td
                            paddingTop={"0.35rem"}
                            paddingBottom={"0.35rem"}
                            paddingLeft={"5px"}
                            paddingRight={"5px"}
                            {...cell?.getCellProps()}
                            key={index}
                            style={
                              cell?.column?.Header === "Manager"
                                ? { padding: "0 5px 0 0" }
                                : cell?.column?.Header === "Agent"
                                ? { padding: 0 }
                                : {}
                            }
                            fontSize={{ sm: "14px" }}
                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                            borderColor="transparent"
                          >
                            {data}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </Box>
        {data?.length > 0 && (
          <Pagination
            gotoPage={gotoPage}
            gopageValue={gopageValue}
            setGopageValue={setGopageValue}
            pageCount={pageCount}
            canPreviousPage={canPreviousPage}
            previousPage={previousPage}
            canNextPage={canNextPage}
            pageOptions={pageOptions}
            setPageSize={setPageSize}
            nextPage={nextPage}
            pageSize={pageSize}
            pageIndex={pageIndex}
          />
        )}

        <AddEmailHistory
          fetchData={fetchData}
          isOpen={addEmailHistory}
          onClose={setAddEmailHistory}
          data={data?.contact}
          lead="true"
          id={selectedId}
        />

        <AddTask
          leadData={taskInits}
          fetchData={() => {}}
          isOpen={isTaskOpen}
          onClose={onTaskClose}
        />

        <AddPhoneCall
          fetchData={fetchData}
          isOpen={addPhoneCall}
          onClose={setAddPhoneCall}
          data={data?.contact}
          id={callSelectedId}
          lead="true"
        />

        {isOpen && (
          <Add
            isOpen={isOpen}
            size={size}
            setLeadData={setLeadData}
            leadData={leadData[0]}
            onClose={onClose}
            fetchData={fetchData}
            setAction={setAction}
            action={action}
          />
        )}
        <Edit
          isOpen={edit}
          size={size}
          setLeadData={setLeadData}
          leadData={leadData[0]}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onClose={setEdit}
          setAction={setAction}
          moduleId={leadData?.[0]?._id}
        />
        <ImportModal
          text="Lead file"
          fetchData={fetchData}
          isOpen={isImportLead}
          onClose={setIsImportLead}
        />
      </Card>
      {/* Advance filter */}
      <AdvancedSearchModal
        advaceSearch={advaceSearch}
        dirty={dirty}
        errors={errors}
        handleBlur={handleBlur}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoding={isLoding}
        resetForm={resetForm}
        setAdvaceSearch={setAdvaceSearch}
        touched={touched}
        values={values}
      />
      <Modal
        size="2xl"
        onClose={() => {
          setIsCoinsModal(null)
        }}
        isOpen={isCoinsModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setAdvaceSearch(false);
              resetForm();
            }}
          />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
              <GridItem colSpan={{ base: 12, md: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="600"
                  color={"#000"}
                  mb="0"
                  mt={2}
                >
                  How much you want to assign?
                </FormLabel>
                <Input
                  fontSize="sm"
                  type="number"
                  onChange={(e)=>setAmount(e?.target?.value)}
                  // onBlur={handleBlur}
                  value={amount}
                  name="leadName"
                  placeholder="Enter Amount"
                  fontWeight="500"
                />
                {/* <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.leadName && touched.leadName && errors.leadName}
                </Text> */}
              </GridItem>
          
           
           
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="brand"
              size="sm"
              mr={2}
              onClick={()=>{
                approveChangeHandler("accept",isCoinsModal)
                setIsCoinsModal(null)
              }}
              disabled={amount ==0}
            >
              {"Continue"}
            </Button>
           
          </ModalFooter>
        </ModalContent>
       </Modal>
      <Modal
onClose={() => {
  setNotesModal(false);
}}
isOpen={notesModal}
isCentered
>
<ModalOverlay />
<ModalContent>
  <ModalHeader>Request Notes </ModalHeader>
  <ModalCloseButton
    onClick={() => {
      setNotesModal(false);
    }}
  />
  
  <ModalBody>

    
    <GridItem colSpan={{ base: 4 }}>
          <Card minH={"50vh"}>
            <Flex
              py={3}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Heading flex={2} size="md">
                Lead Notes/Comments
              </Heading>

              
               
               <Flex flex={1} justifyContent={"flex-end"} alignItems={"center"}>
               
                <Button color="white"
                 onClick={() => setNewNoteModal(true)} 
                 style={{
                  padding: "0 20px", 
                  color: "white",
                }} leftIcon={<FaPlus />} size="sm" variant="brand">
                  Add New Note
                </Button>
              </Flex>
            </Flex>
            <HSeparator />
             
            <LeadNotes notes={allData.find(data=>data?._id === notesModal)?.requestNotes} />
            
          </Card>
        </GridItem>
  </ModalBody>
  <ModalFooter>

  </ModalFooter>
</ModalContent>
</Modal> 
 
      {/* Delete model */}
      <Delete
        isOpen={deleteModel}
        onClose={setDelete}
        setSelectedValues={setSelectedValues}
        url="api/lead/deleteMany"
        data={selectedValues}
        method="many"
        setAction={setAction}
        setSelectAllChecked={setSelectAllChecked}
      />
       <NewNoteModal
        isOpen={newNoteModal}
        onClose={() => setNewNoteModal(false)}
        paramId={notesModal}
        fetchData={fetchData}
        // setNoteAdded={setNoteAdded}
      />
      
      
    </>
    
  );
}



