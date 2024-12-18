import { useDisclosure } from "@chakra-ui/react";
import CheckTable from "./components/CheckTable";
import { useEffect, useState } from "react";
import { getApi } from "services/api";

const Index = () => {
  const tableColumns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
    },
    { Header: "TRN", accessor: "trn" },
    { Header: "Developer Name", accessor: "developer_name" },
    { Header: "Address", accessor: "address" },
    { Header: "Email ID", accessor: "email" },
    { Header: "Action", isSortable: false, center: true },
  ];
  const [action, setAction] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
  const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
  const [columns, setColumns] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const { isOpen } = useDisclosure();

  const fetchData = async () => {
    setIsLoding(true);
    let result = await getApi(
         `api/developers`, null, "server2"
    );
    setData(result.data || []);
    setIsLoding(false);
  };

  useEffect(() => {
    setColumns(tableColumns);
  }, [action]);

  const dataColumn = dynamicColumns?.filter((item) =>
    selectedColumns?.find((colum) => colum?.Header === item.Header)
  );

  return (
    <div>
      <CheckTable
        // isOpen={isOpen} setAction={setAction} action={action} columnsData={columns}
        isLoding={isLoding}
        columnsData={columns}
        isOpen={isOpen}
        setAction={setAction}
        action={action}
        setSearchedData={setSearchedData}
        allData={data}
        displaySearchData={displaySearchData}
        tableData={displaySearchData ? searchedData : data}
        fetchData={fetchData}
        dataColumn={dataColumn}
        setDisplaySearchData={setDisplaySearchData}
        setDynamicColumns={setDynamicColumns}
        dynamicColumns={dynamicColumns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
      {/* Add Form */}
    </div>
  );
};

export default Index;
