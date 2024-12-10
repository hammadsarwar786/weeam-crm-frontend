import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import UsersView from "../default/components/UsersView";
import TeamsView from "../default/components/TeamsView";

const Report = () => {
  const [dateTime, setDateTime] = useState({
    from: "",
    to: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  let tableColumns = [];

  if (user.role === "superAdmin") {
    tableColumns.unshift(
      {
        Header: "#",
        accessor: "_id",
        isSortable: false,
        width: 10,
      },
      { Header: "Name", accessor: "firstName" }
    );
  }

  return (
    <div>
      <SimpleGrid gap="20px" columns={{ base: 1 }} my="20px">
        {(user?.roles[0]?.roleName === "Manager") && (
          <>
            <Flex alignItems={"center"} className="date-range-selector">
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
                  <Flex ms={10} alignItems={"center"}>
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

            <UsersView dateTime={{...dateTime}} />

          </>
        )}

        {user?.role === "superAdmin" && (
          <TeamsView setDateTime={setDateTime} dateTime={dateTime} />
        )}
      </SimpleGrid>
    </div>
  );
};

export default Report;
