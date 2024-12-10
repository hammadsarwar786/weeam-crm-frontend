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
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  FaHistory,
  FaLessThan,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getApi } from "services/api";
import Delete from "../Delete";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import Add from "../Add";
import { AddIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
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
import { MdTask } from "react-icons/md";
import AddTask from "./addTask";
import LeadsModal from "../LeadsModal";
import LastNoteText from "./LastNoteText";
import AdvancedSearchModal from "./AdvancedSearchModal";
// import SizeExample from "./Dummy";

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
    setDisplayAdvSearchData,
    displayAdvSearchData,
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
    fetchAdvancedSearch,
    totalLeads,
    fetchSearchedData,
    setData,
  } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [leadData, setLeadData] = useState([]);
  const columns = useMemo(() => dataColumn, [dataColumn]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [getTagValues, setGetTagValues] = useState([]);
  const [gopageValue, setGopageValue] = useState(1);

  const user = JSON.parse(localStorage.getItem("user"));
  const tree = useSelector((state) => state.user.tree);

  const [leadsModal, setLeadsModal] = useState({
    isOpen: false,
    lid: null,
  });
  const [deleteModel, setDelete] = useState(false);
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const { isOpen:isSearchOpen, onOpen:onSearchOpen, onClose:onSearchClose } = useDisclosure();
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
  

  const refreshData =()=>{
    if(displaySearchData){
      fetchSearchedData(searchbox.current?.value?.trim() || "", 1, pageSize);
    }else if(displayAdvSearchData){
      const data = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => value !== "")
      );
      fetchAdvancedSearch(data, pageIndex+1, pageSize);
    }else {
      fetchData(pageIndex+1,pageSize);
    }
  }

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

      const data = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => value !== "")
      );
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim();
          if (key === 'leadPhoneNumber') {
            data[key] = Number(data[key]);
          }
        }
      });

      fetchAdvancedSearch(data, 1, pageSize);
      setUpdatedPage(0);
      setGopageValue(1);

      let agent = null;
      // if (values?.agentAssigned && user?.roles[0]?.roleName === "Manager") {
      //   agent = tree["agents"]["manager-" + user?._id?.toString()]?.find(
      //     (user) => user?._id?.toString() === values?.agentAssigned
      //   );
      // } else if (values?.agentAssigned && values?.managerAssigned) {
      //   agent = tree["agents"]["manager-" + values.managerAssigned]?.find(
      //     (user) => user?._id?.toString() === values?.agentAssigned
      //   );
      // }
      if(values?.agentAssigned){
        const agentsArray = Object.values(tree.agents).flatMap(managerArray => managerArray);
       agent = agentsArray.find(agent=>agent?._id?.toString() === values?.agentAssigned)
      }
      if(values?.agentAssigned == -1){
        agent ={ firstName:"No",lastName:" Agent"}
      }
      let manager = null;
      if (values?.managerAssigned) {
        manager = tree["managers"]?.find(
          (user) => user?._id?.toString() === values?.managerAssigned
        );
      }
      if(values?.managerAssigned == -1){
        manager = {firstName:"No",lastName:"Manager"}
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
      setAdvaceSearch(false);
      setSearchClear(true);
      // resetForm();
    },
  });
  const handleClear = () => {
    searchbox.current.value = "";
    setDisplaySearchData(false);
    setDisplayAdvSearchData(false)
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

  const hiddenFields = JSON.parse(localStorage.getItem("hiddenCols") || "[]") || [];

  const [columnVisibility, setColumnVisibility] = useState(
    hiddenFields?.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {})
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      state: { columnVisibility },
      onColumnVisibilityChange: setColumnVisibility,
      initialState: { pageIndex: updatedPage, pageSize: 200 },
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

  const handleLeadsModal = (lid) => {
    setLeadsModal({
      isOpen: true,
      lid,
    });
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
    if (searchbox.current?.value?.trim()) {
      fetchSearchedData(searchbox.current?.value?.trim(), 1, pageSize);
      setUpdatedPage(0);
      setGopageValue(1);
    }
  };

  useEffect(() => {
    setGopageValue(1);
    setUpdatedPage(0);
    if (displaySearchData) {
      fetchSearchedData(searchbox.current?.value?.trim());
    } else if(displayAdvSearchData){
      fetchAdvancedSearch();
    } else {
      fetchData();
    }
  }, [action]);

  useEffect(() => {
    setGopageValue(1);
    setUpdatedPage(0);
    if (
      fetchData &&
      (dateTime.from !== null || dateTime.to !== null) &&
      !displaySearchData
    )
      fetchData();
  }, [dateTime]);

  useEffect(() => {
    setUpdatedPage(pageIndex);
    if (displaySearchData) {
      fetchSearchedData(
        searchbox.current?.value?.trim() || "",
        pageIndex + 1,
        pageSize
      );
    }else if(displayAdvSearchData){
      const data = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => value !== "")
      );
      fetchAdvancedSearch(data,pageIndex+1,pageSize)
     console.log(values,'values of the form ')
    } else {
      fetchData(pageIndex + 1, pageSize);
    }
  }, [pageIndex]);

  useEffect(() => {
    setUpdatedPage(0);
    setGopageValue(1);
    if (displaySearchData) {
      fetchSearchedData(searchbox.current?.value?.trim() || "", 1, pageSize);
    } else if(displayAdvSearchData){
    const data = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => value !== "")
      );
      fetchAdvancedSearch(data,1,pageSize)
    }
    else {
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
        <Flex alignItems={"center"}>
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
        </Flex>
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
        <Grid templateColumns="repeat(12, 1fr)" gap={2}>
          <GridItem
            colSpan={{ base: 8 }}
            display={"flex"}
            alignItems={"center"}
          >
            <Flex alignItems={"center"} flexWrap={"wrap"}>
              <Text
                color={useColorModeValue("secondaryGray.900", "white")}
                fontSize="22px"
                fontWeight="700"
              >
                Leads (<span>{totalLeads || 0}</span>)
              </Text>
              <CustomSearchInput
                searchbox={searchbox}
                dataColumn={dataColumn}
                isPaginated={true}
                fetchSearch={fetchSearch}
              />
              <Button
                variant="outline"
                colorScheme="brand"
                leftIcon={<SearchIcon />}
                onClick={() => setAdvaceSearch(true)}
                mt={{ sm: "5px", md: "0" }}
                size="sm"
              >
                Advance Search
              </Button>
              {(displaySearchData || displayAdvSearchData)? (
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="red"
                  ms={2}
                  onClick={() => {
                    handleClear();

                    setGetTagValues([]);
                  }}
                >
                  Clear
                </Button>
              ) : (
                ""
              )}
              {selectedValues.length > 0 && access?.delete && (
                <DeleteIcon
                  cursor={"pointer"}
                  onClick={() => setDelete(true)}
                  color={"red"}
                  ms={2}
                />
              )}
            </Flex>
          </GridItem>

          {/* <GridItem
            display={"flex"}
            alignItems={"center"}
            colSpan={{ base: 5 }}
          >
            <Flex
              alignItems={"center"}
              style={{
                position: "relative",
                left: "-15px",
                fontSize: 15,
              }}
              className="date-range-selector"
            >
              <Flex alignItems={"center"}>
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
              </Flex>
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
            </Flex>
          </GridItem> */}

          <GridItem
            colSpan={{ base: 4 }}
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
            textAlign={"right"}
          >
            <Menu isLazy>
              <MenuButton p={4}>
                <BsColumnsGap />
              </MenuButton>
              <MenuList
                minW={"fit-content"}
                transform={"translate(1670px, 60px)"}
                zIndex={2}
              >
                <MenuItem
                  onClick={() => setManageColumns(true)}
                  width={"165px"}
                >
                  {" "}
                  Manage Columns
                </MenuItem>
                {user?.role === "superAdmin" && (
                  <MenuItem
                    width={"165px"}
                    onClick={() => setIsImportLead(true)}
                  >
                    {" "}
                    Import Leads
                  </MenuItem>
                )}
                <MenuDivider />
                <MenuItem
                  width={"165px"}
                  onClick={() => handleExportLeads("csv")}
                >
                  {selectedValues && selectedValues?.length > 0
                    ? "Export Selected Data as CSV"
                    : "Export as CSV"}
                </MenuItem>
                <MenuItem
                  width={"165px"}
                  onClick={() => handleExportLeads("xlsx")}
                >
                  {selectedValues && selectedValues?.length > 0
                    ? "Export Selected Data as Excel"
                    : "Export as Excel"}
                </MenuItem>
              </MenuList>
            </Menu>
            {access?.create && (
              <Button
                onClick={() => handleClick()}
                size="sm"
                variant="brand"
                leftIcon={<AddIcon />}
              >
                Add New
              </Button>
            )}
          </GridItem>
          <HStack spacing={4} mb={2}>
            {getTagValues &&
              getTagValues.map((item) => (
                <Tag
                  size={"md"}
                  p={2}
                  key={item}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="gray"
                >
                  <TagLabel>{item}</TagLabel>
                </Tag>
              ))}
          </HStack>
        </Grid>

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
                        fontSize={{ sm: "14px", lg: "16px" }}
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
                        } else if (cell?.column.Header === "Name") {
                          data = access?.view ? (
                            <Text
                              onClick={() =>
                                handleLeadsModal(row.original?._id)
                              }
                              me="10px"
                              sx={{
                                "&:hover": {
                                  color: "blue.500",
                                  textDecoration: "underline",
                                },
                              }}
                              cursor="pointer"
                              color="brand.600"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value?.text || cell?.value}
                            </Text>
                          ) : (
                            <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value?.text || cell?.value}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Whatsapp Number") {
                          data = (
                            <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value?.text || cell?.value || "-"}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Phone Number") {
                          data = callAccess?.create ? (
                            <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                              color="brand.600"
                              sx={{
                                "&:hover": {
                                  color: "blue.500",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                },
                              }}
                              onClick={() => {
                                setAddPhoneCall(true);
                                setCallSelectedId(row?.original?._id);
                              }}
                            >
                              {cell?.value?.formula || cell?.value || "-"}
                            </Text>
                          ) : (
                            <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value?.formula || cell?.value || "-"}
                            </Text>
                          );
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
                        } else if (cell?.column.Header === "Status") {
                          data = (
                            <div className="selectOpt">
                              <RenderStatus
                                setUpdatedStatuses={setUpdatedStatuses}
                                id={cell?.row?.original?._id}
                                cellValue={cell?.value}
                              />
                            </div>
                          );
                        } else if (cell?.column.Header === "Manager") {
                          data = (
                            <RenderManager
                              fetchData={fetchData}
                              displaySearchData={displaySearchData || displayAdvSearchData}
                              setSearchedData={setSearchedData}
                              pageIndex={pageIndex}
                              setData={setData}
                              leadID={row?.original?._id?.toString()}
                              value={cell?.value}
                            />
                          );
                        } else if (cell?.column.Header === "Agent") {
                          data = (
                            <>
                              <RenderAgent
                                setData={setData}
                                fetchData={fetchData}
                                leadID={row?.original?._id?.toString()}
                                managerAssigned={row?.original?.managerAssigned}
                                displaySearchData={displaySearchData || displayAdvSearchData}
                                setSearchedData={setSearchedData}
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
                              {new Date(
                                cell?.value?.text || cell?.value
                              ).toLocaleString() || "-"}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Last Note") {
                          data = (
                            <Box maxWidth={300}>
                              <LastNoteText text={cell?.value} />
                            </Box>
                          );
                        } else if (cell?.column.Header === "IP") {
                          data = (
                            <Text fontSize={"sm"}>{cell?.value || "-"}</Text>
                          );
                        } else if (cell?.column.Header === "Lead Address") {
                          data = (
                            <Text fontSize={"sm"}>{cell?.value || "-"}</Text>
                          );
                        } else if (cell?.column.Header === "Lead Campaign") {
                          data = (
                            <Text fontSize={"sm"}>{cell?.value || "-"}</Text>
                          );
                        } else if (cell?.column.Header === "Source Content") {
                          data = (
                            <Text fontSize={"sm"}>{cell?.value || "-"}</Text>
                          );
                        } else if (cell?.column.Header === "Lead Email") {
                          data = (
                            <Text fontSize={"sm"}>{cell?.value || "-"}</Text>
                          );
                        } else if (cell?.column.Header === "Lead Medium") {
                          data = (
                            <Text fontSize={"sm"}>{cell?.value || "-"}</Text>
                          );
                        } else if (
                          cell?.column.Header === "Campaign Page URL"
                        ) {
                          data = (
                            <Text fontSize={"sm"}>{cell?.value || "-"}</Text>
                          );
                        } else if (cell?.column.Header === "Are you in UAE?") {
                          data = (
                            <Text fontSize={"sm"}>{cell?.value || "-"}</Text>
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
                                  {callAccess?.create && (
                                    <MenuItem
                                      py={2.5}
                                      width={"165px"}
                                      onClick={() => {
                                        setAddPhoneCall(true);
                                        setCallSelectedId(
                                          cell?.row?.values._id
                                        );
                                      }}
                                      icon={<PhoneIcon fontSize={15} mb={1} />}
                                    >
                                      Create Call
                                    </MenuItem>
                                  )}
                                  {emailAccess?.create && (
                                    <MenuItem
                                      py={2.5}
                                      width={"165px"}
                                      onClick={() => {
                                        setAddEmailHistory(true);
                                        setSelectedId(cell?.row?.values._id);
                                      }}
                                      icon={<EmailIcon fontSize={15} mb={1} />}
                                    >
                                      Send Email
                                    </MenuItem>
                                  )}
                                  <MenuItem
                                    py={2.5}
                                    width={"max-content"}
                                    onClick={() => {
                                      navigate(
                                        "/leadCycle/" + row?.original?._id
                                      );
                                    }}
                                    icon={<FaHistory fontSize={15} mb={1} />}
                                  >
                                    View Lead cycle
                                  </MenuItem>
                                  <MenuItem
                                    py={2.5}
                                    width={"max-content"}
                                    onClick={() => {
                                      navigate(
                                        "/leadHistory/" + cell?.row?.values?._id
                                      );
                                    }}
                                    icon={<FaHistory fontSize={15} mb={1} />}
                                  >
                                    View Call history
                                  </MenuItem>

                                  <MenuItem
                                    display={{ sm: "block", xl: "none" }}
                                    py={2.5}
                                    width={"195px"}
                                    onClick={() => {
                                      const contact = parseInt(
                                        cell?.row?.values?.leadPhoneNumber
                                      );
                                      if (contact)
                                        document.location.href = `tel:+92${contact}`;
                                    }}
                                    icon={<PhoneIcon fontSize={15} mb={1} />}
                                  >
                                    Open in Dialpad
                                  </MenuItem>

                                  <MenuItem
                                    py={2.5}
                                    width={"210px"}
                                    onClick={() => {
                                      const contact = parseInt(
                                        cell?.row?.values?.leadPhoneNumber
                                      );
                                      if (contact)
                                        window.open(
                                          `https://api.whatsapp.com/send/?phone=${contact}`
                                        );
                                    }}
                                    icon={<BsWhatsapp fontSize={15} mb={1} />}
                                  >
                                    Open in Whatsapp
                                  </MenuItem>
                                  {user?.roles[0]?.roleName === "Agent" && (
                                    <MenuItem
                                      py={2.5}
                                      width={"210px"}
                                      onClick={() => {
                                        setTaskInits(row?.original);
                                        onTaskOpen();
                                      }}
                                      icon={<MdTask fontSize={15} mb={1} />}
                                    >
                                      Create Follow Up
                                    </MenuItem>
                                  )}
                                  {/* {access?.view && (
                                    <MenuItem
                                      py={2.5}
                                      color={"green"}
                                      onClick={() =>
                                        navigate(
                                          `/leadView/${cell?.row?.original._id}`
                                        )
                                      }
                                      icon={<ViewIcon fontSize={15} mb={1} />}
                                    >
                                      View
                                    </MenuItem>
                                  )} */}
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
        onClose={() => {
          setManageColumns(false);
        }}
        isOpen={manageColumns}
        isCentered
      >
        <ModalOverlay />
        <ModalContent height={"90vh"} overflowY={"scroll"}>
          <ModalHeader>Manage Columns</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setManageColumns(false);
            }}
          />
          <ModalBody>
            <div>
              {dynamicColumns.map((column) => (
                <Text display={"flex"} key={column.accessor} py={2}>
                  <Checkbox
                    value={selectedColumns.some(
                      (selectedColumn) =>
                        selectedColumn.accessor === column.accessor
                    )}
                    defaultChecked={selectedColumns.some(
                      (selectedColumn) =>
                        selectedColumn.accessor === column.accessor
                    )}
                    onChange={() => toggleColumnVisibility(column.accessor)}
                    pe={2}
                  />
                  {column.Header}
                </Text>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="brand"
              size="sm"
              mr={2}
              onClick={() => {
                setSelectedColumns(tempSelectedColumns);
                const tempAccessors = tempSelectedColumns.map(
                  (t) => t.accessor
                );
                localStorage.setItem(
                  "hiddenCols",
                  JSON.stringify(
                    dynamicColumns.filter(
                      (d) => !tempAccessors.includes(d.accessor)
                    ).map((d) => d.accessor)
                  )
                );
                setManageColumns(false);
                resetForm();
              }}
              disabled={isLoding ? true : false}
            >
              {isLoding ? <Spinner /> : "Save"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={() => handleColumnClear()}
            >
              Close
            </Button>
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

      {leadsModal.isOpen && (
        <LeadsModal
          leadsModal={leadsModal}
          onClose={() => setLeadsModal({ isOpen: false, lid: null })}
          reFreshData={refreshData}
        />
      )}
    </>
  );
}
