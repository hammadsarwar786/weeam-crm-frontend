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
import { useEffect, useMemo, useState } from "react";
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
import { FaHistory, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getApi } from "services/api";
import Delete from "../Delete";
import Add from "../Add";
import { AddIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import Edit from "../Edit";
import { useFormik } from "formik";
import { BsColumnsGap, BsWhatsapp } from "react-icons/bs";
import * as yup from "yup";
import CustomSearchInput from "components/search/search";
import DataNotFound from "components/notFoundData";
import { MdTask } from "react-icons/md";

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
    dateTime,
    setDateTime,
  } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [leadData, setLeadData] = useState([]);
  const columns = useMemo(() => dataColumn, [dataColumn]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [getTagValues, setGetTagValues] = useState([]);
  const [gopageValue, setGopageValue] = useState();

  const user = JSON.parse(localStorage.getItem("user"));
  const tree = useSelector((state) => state.user.tree);

  const [deleteModel, setDelete] = useState(false);
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [setSearchClear] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [callSelectedId, setCallSelectedId] = useState();
  const navigate = useNavigate();
  const data = useMemo(() => tableData, [tableData]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isTaskOpen,
    onOpen: onTaskOpen,
    onClose: onTaskClose,
  } = useDisclosure();
  const [edit, setEdit] = useState(false);
  const [updatedPage, setUpdatedPage] = useState(0);
  const [isImportLead, setIsImportLead] = useState(false);
  const [searchbox, setSearchbox] = useState("");
  const [column, setColumn] = useState("");
  const [updatedStatuses, setUpdatedStatuses] = useState([]);
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn); // State to track changes

  const csvColumns = [
    { Header: "Name", accessor: "leadName" },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Whatsapp Number", accessor: "leadWhatsappNumber" },
    { Header: "Phone Number", accessor: "leadPhoneNumber" },
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
    leadAddress: "",
    leadOwner: "",
    managerAssigned: "",
    agentAssigned: "",
    fromLeadScore: "",
    toLeadScore: "",
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
              item?.agentAssigned
                ?.toLowerCase()
                ?.includes(values?.agentAssigned?.toLowerCase()))) &&
          (!values?.leadPhoneNumber ||
            (item?.leadPhoneNumber &&
              item?.leadPhoneNumber
                ?.toString()
                ?.includes(values?.leadPhoneNumber))) &&
          (!values?.leadOwner ||
            (item?.leadOwner &&
              item?.leadOwner
                ?.toLowerCase()
                ?.includes(values?.leadOwner?.toLowerCase()))) &&
          ([null, undefined, ""].includes(values?.fromLeadScore) ||
            [null, undefined, ""].includes(values?.toLeadScore) ||
            ((item?.leadScore || item?.leadScore === 0) &&
              (parseInt(item?.leadScore, 10) >=
                parseInt(values.fromLeadScore, 10) ||
                0) &&
              (parseInt(item?.leadScore, 10) <=
                parseInt(values.toLeadScore, 10) ||
                0)))
      );

      let agent = null;
      if (values?.agentAssigned) {
        agent = tree["agents"]["manager-" + user?._id?.toString()]?.find(
          (user) => user?._id?.toString() === values?.agentAssigned
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
        (agent && agent?.firstName + " " + agent?.lastName) || "",
        values?.leadPhoneNumber,
        values?.leadOwner,
        (![null, undefined, ""].includes(values?.fromLeadScore) &&
          `${values.fromLeadScore}-${values.toLeadScore}`) ||
          undefined,
      ].filter((value) => value);
      setGetTagValues(getValue);
      setSearchedData(searchResult);
      setDisplaySearchData(true);
      setAdvaceSearch(false);
      setSearchClear(true);
      resetForm();
    },
  });
  const handleClear = () => {
    setDisplaySearchData(false);
  };

  useEffect(() => {
    setSearchedData && setSearchedData(data);
  }, []);
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
      initialState: { pageIndex: updatedPage },
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

  useEffect(() => {
    if (fetchData) fetchData();
  }, [action, dateTime]);

  const handleSearch = (results) => {
    setSearchedData(results);
  };

  useEffect(() => {
    console.log("page changed::", pageIndex);
    setUpdatedPage(pageIndex);
  }, [pageIndex]);

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
                Employee Managmnet 
              </Text>
              
              <Button
                variant="outline"
                colorScheme="brand"
                leftIcon={<SearchIcon />}
                onClick={() => setAdvaceSearch(true)}
                mt={{ sm: "5px", md: "0" }}
                size="sm"
                ml="10"
              >
                Advance Search
              </Button>
              {displaySearchData ? (
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="red"
                  ms={2}
                  onClick={() => {
                    handleClear();
                    setSearchbox("");
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
                <MenuItem width={"165px"} onClick={() => setIsImportLead(true)}>
                  {" "}
                  Import Leads
                </MenuItem>
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
              <>
              <Button
                onClick={() => handleClick()}
                size="sm"
                mr="1"
                variant="brand"
                leftIcon={<AddIcon />}
              >
                Add New
              </Button>
              <Button
                onClick={() => handleClick()}
                size="sm"
                variant="brand"
                // leftIcon={<AddIcon />}
              >
                Back
              </Button>
              </>
            )}
          </GridItem>
          <HStack  spacing={4} mb={2}>
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
                  <TagLabel >{item}</TagLabel>
                </Tag>
              ))}
          </HStack>
        </Grid>

        <Box  overflowY={"auto"} className="table-fix-container">
          <Table 
            {...getTableProps()}
            variant="simple"
            color="gray.500"
            mb="24px"
          >
            <Thead  zIndex={1}>
              {headerGroups?.map((headerGroup, index) => (
                <Tr backgroundColor="#ebd3a6"  {...headerGroup.getHeaderGroupProps()} key={index}>
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
                        color="secondaryGray.900"
                      >
                        <span
                          style={{
                            textTransform: "capitalize",
                            marginRight: "8px",
                          }}
                        >
                          {column.render("Header")}
                        </span>

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
                                isChecked={selectedValues.includes(cell?.value)}
                                onChange={(event) =>
                                  handleCheckboxChange(event, cell?.value)
                                }
                                me="10px"
                              />
                              <Text
                                color={textColor}
                                fontSize="sm"
                                // fontWeight="500"
                                fontWeight="700"
                              >
                                {cell?.row?.index + 1}
                              </Text>
                            </Flex>
                          );
                        } else if (cell?.column.Header === "Date") {
                          data = 
                              <Text
                                me="10px"
                                color="brand.600"
                                fontSize="sm"
                              >
                              {new Date(cell?.value).toLocaleString() || "-"}
                              </Text>; 
                        } else if (cell?.column.Header === "Developer") {
                          data = (
                            <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value || "-"}
                            </Text>
                          );
                        } else if (cell?.column.Header === "Bank Account") {
                          data = 
                            <Text
                              me="10px"
                              fontSize="sm"
                              // fontWeight="500"
                              >
                              {cell?.value || "-"}
                            </Text>; 
                        } else if (cell?.column.Header === "Total Amount") {
                          data = (
                            <Text
                              color={textColor}
                              fontSize="sm"
                              // fontWeight="500"
                              fontWeight="700"
                            >
                              {cell?.value || 0} AED
                            </Text>
                          );
                
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
                              {cell?.value || "-"}
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
                                </MenuList>
                              </Menu>
                            </Text>
                          );
                        }
                        return (
                          <Td
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
        {data?.length > 5 && (
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
      
      </Card>
      {/* Advance filter */}
      <Modal
        onClose={() => {
          setAdvaceSearch(false);
          resetForm();
        }}
        isOpen={advaceSearch}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Advance Search</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setAdvaceSearch(false);
              resetForm();
            }}
          />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="600"
                  color={"#000"}
                  mb="0"
                  mt={2}
                >
                  Name
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.leadName}
                  name="leadName"
                  placeholder="Enter Lead Name"
                  fontWeight="500"
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.leadName && touched.leadName && errors.leadName}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="600"
                  color={"#000"}
                  mb="0"
                  mt={2}
                >
                  Status
                </FormLabel>
                <Select
                  value={values?.leadStatus}
                  fontSize="sm"
                  name="leadStatus"
                  onChange={handleChange}
                  fontWeight="500"
                  placeholder={"Select Lead Status"}
                >
                  <option value="active">Interested</option>
                  <option value="pending">Not-interested</option>
                  <option value="sold">Sold</option>
                  <option value="new">New</option>
                  <option value="no_answer">No answer</option>
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
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.leadStatus && touched.leadStatus && errors.leadStatus}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="600"
                  color={"#000"}
                  mb="0"
                  mt={2}
                >
                  Email
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.leadEmail}
                  name="leadEmail"
                  placeholder="Enter Lead Email"
                  fontWeight="500"
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.leadEmail && touched.leadEmail && errors.leadEmail}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="600"
                  color={"#000"}
                  mb="0"
                  mt={2}
                >
                  Phone Number
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.leadPhoneNumber}
                  name="leadPhoneNumber"
                  placeholder="Enter Lead PhoneNumber"
                  fontWeight="500"
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.leadPhoneNumber &&
                    touched.leadPhoneNumber &&
                    errors.leadPhoneNumber}
                </Text>
              </GridItem>

              {/* <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='600' color={"#000"} mb="0" mt={2}>
                  Owner
                </FormLabel>
                <Input
                  fontSize='sm'
                  onChange={handleChange} onBlur={handleBlur}
                  value={values?.leadOwner}
                  name="leadOwner"
                  placeholder='Enter Lead Owner'
                  fontWeight='500'
                />
                <Text mb='10px' color={'red'}> {errors.leadOwner && touched.leadOwner && errors.leadOwner}</Text>

              </GridItem> */}
              {user?.roles[0]?.roleName === "Manager" && (
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="600"
                    color={"#000"}
                    mb="0"
                    mt={2}
                  >
                    Agent
                  </FormLabel>
                  <Box>
                    <Select
                      name="agentAssigned"
                      onChange={handleChange}
                      value={values["agentAssigned"]}
                    >
                      <option selected value={""}>
                        Select agent
                      </option>
                      {tree &&
                        tree["managers"] &&
                        tree["agents"]["manager-" + user?._id?.toString()]?.map(
                          (user) => {
                            return (
                              <option
                                key={user?._id?.toString()}
                                value={user?._id?.toString()}
                              >
                                {user?.firstName + " " + user?.lastName}
                              </option>
                            );
                          }
                        )}
                    </Select>
                  </Box>

                  <Text mb="10px" color={"red"}>
                    {" "}
                    {errors.fromLeadScore &&
                      touched.fromLeadScore &&
                      errors.fromLeadScore}
                  </Text>
                </GridItem>
              )}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="brand"
              size="sm"
              mr={2}
              onClick={handleSubmit}
              disabled={isLoding || !dirty ? true : false}
            >
              {isLoding ? <Spinner /> : "Search"}
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={() => resetForm()}
            >
              Clear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        onClose={() => {
          setManageColumns(false);
        }}
        isOpen={manageColumns}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
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
      />
    </>
  );
}
