import {
    Box,
    Flex,
    Radio,
    RadioGroup,
    Stack,
    Table, Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from "react-table";

// Custom components
import { DeleteIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import Pagination from "components/pagination/Pagination";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Delete from "views/admin/contact/Delete";
import DataNotFound from "components/notFoundData";


export default function CheckTable(props) {
    const { barData, selection, setSelection, tableColumns, isLoading } = props;

    const textColor = useColorModeValue("gray.500", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const columns = useMemo(() => tableColumns, [tableColumns]);
    const [selectedValues, setSelectedValues] = useState([]);
    const [deleteModel, setDelete] = useState(false);
    const data = useMemo(() => barData, [barData]);
    const [gopageValue, setGopageValue] = useState()

    const headingColor = useColorModeValue("secondaryGray.900", "white"); 


    const tableInstance = useTable(
        {
            columns, data,
            initialState: { pageIndex: 0 }
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
        state: { pageIndex, pageSize }
    } = tableInstance;

    if (pageOptions.length < gopageValue) {
        setGopageValue(pageOptions.length)
    }

    return (
        <Card
            direction="column"
            w="100%"
            px="0px"
            overflowX={{ sm: "scroll", lg: "scroll" }}
        >
            <Flex px="25px" justify="space-between" mb="20px" align="center">
                <div>
                    <Text
                        color={textColor}
                        fontSize="22px"
                        fontWeight="700"
                        lineHeight="100%"
                    >
                        Reports ({data.length})
                    </Text>
                    {/* <Menu /> */}
                    {selectedValues.length > 0 && <DeleteIcon onClick={() => setDelete(true)} color={'red'} />}
                </div>
                <div>
                       <RadioGroup onChange={(e) => setSelection(e)} value={selection}>
                            <Stack direction='row'>
                                <Radio value='all' >All</Radio>
                                <Radio value='today'>Today</Radio>
                            </Stack>
                        </RadioGroup>

                </div>
            </Flex>
            {/* Delete model */}
            <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/contact/deleteMany' data={selectedValues} method='many' />
            <Box overflowY={"auto"} className="table-fix-container">

                <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
                    <Thead>
                        {headerGroups?.map((headerGroup, index) => (
                            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                {headerGroup.headers?.map((column, index) => (
                                    <Th
                                        {...column.getHeaderProps(column.isSortable !== false && column.getSortByToggleProps())}
                                        pe="10px"
                                        key={index}
                                        borderColor={borderColor}
                                    >
                                        <Flex
                                            align="center"
                                            justifyContent={column.center ? "center" : "start"}
                                            fontSize={{ sm: "14px", lg: "16px" }}
                                                            color={headingColor}

                                        >
                                            <span style={{ textTransform: "capitalize", marginRight: "8px" }}>
                                                {column.render("Header")}
                                            </span>
                                            {column.isSortable !== false && (
                                                <span>
                                                    {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : <FaSort />}
                                                </span>
                                            )}
                                        </Flex>
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()}>
       
                        {!isLoading && data.length === 0 && (
                            <Tr>
                                <Td colSpan={columns.length}>
                                    <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                                        <DataNotFound />
                                    </Text>
                                </Td>
                            </Tr>
                        )}
                        {page?.map((row, i) => {
                            prepareRow(row);
                            return (
                                <Tr {...row?.getRowProps()} key={i}>
                                    {row?.cells?.map((cell, index) => {
                                        let data = "";
                                        if (cell?.column.Header === "#") {
                                            data = (
                                                <Flex align="center">
                                                    <Text color={textColor} fontSize="sm" fontWeight="700">
                                                        {cell?.row?.index + 1}
                                                    </Text>
                                                </Flex>
                                            );
                                        } else if (cell?.column.Header === "Name") {
                                            data = (
                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value}
                                                </Text>
                                            );
                                        } else if (cell?.column.Header === "Email Sent") {
                                            data = (

                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value}
                                                </Text>
                                            );
                                        } else if (cell?.column.Header === "Text Sent") {
                                            data = (
                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value}
                                                </Text>
                                            );
                                        }
                                        else if (cell?.column.Header === "Outbound Calls") {
                                            data = (
                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value}
                                                </Text>
                                            );
                                        }
                                        else if (cell?.column.Header === "Email Received") {
                                            data = (
                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value}
                                                </Text>
                                            );
                                        }
                                        else if (cell?.column.Header === "Text Received") {
                                            data = (
                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value}
                                                </Text>
                                            );
                                        } else if(cell?.column.Header === "Leads") {
                                            data = (
                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value || 0}
                                                </Text>
                                            );

                                        }
                                        else if(cell?.column.Header === "Contacts") {
                                            data = (
                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value || 0}
                                                </Text>
                                            );

                                        }else if(cell?.column.Header === "Properties") {
                                            data = (
                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value || 0}
                                                </Text>
                                            );

                                        }
                                        else if(cell?.column.Header === "Tasks") {
                                            data = (
                                                <Text
                                                    me="10px"
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell?.value || 0}
                                                </Text>
                                            );

                                        }

                                        return (
                                            <Td
                                                {...cell?.getCellProps()}
                                                key={index}
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
                        })}
                    </Tbody>
                </Table>
            </Box>
            {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage} pageSize={pageSize} pageIndex={pageIndex} />}
        </Card>
    );
}
