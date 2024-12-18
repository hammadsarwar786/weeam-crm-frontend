import { Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";
import CheckTable from "./components/CheckTable";
import { useSelector } from "react-redux";

const Index = () => {
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
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Date", accessor: "created_at"},
    { Header: "Developer", accessor: "developer.developer_name" },
    { Header: "Bank Account", accessor: "bank_account.account_holder_name" },
    { Header: "Total Amount", accessor: "total_amount" },
    { Header: "Action", isSortable: false, center: true },
  ];
  const tableColumnsManager = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Date", accessor: "created_at"},
    { Header: "Developer", accessor: "developer.developer_name" },
    { Header: "Bank Account", accessor: "bank_account.account_holder_name" },
    { Header: "Total Amount", accessor: "total_amount" },
    { Header: "Action", isSortable: false, center: true },
  ];
  const tableColumnsAgent = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Date", accessor: "created_at"},
    { Header: "Developer", accessor: "developer.developer_name" },
    { Header: "Bank Account", accessor: "bank_account.account_holder_name" },
    { Header: "Total Amount", accessor: "total_amount" },
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



  return (
    <div>
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
    </div>
  );
};

export default Index;
