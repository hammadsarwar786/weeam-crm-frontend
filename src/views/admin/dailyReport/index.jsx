import Card from "components/card/Card";
import UserModal from "../role/components/userModal";
import CreateDailyReport from "./CreateDailyReport";
import ShowDailyReports from "./ShowDailyReports";

const DailyReport = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(UserModal);
  return (
    <>
      <Card
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        {user?.roles[0]?.roleName === "Manager" ? (
          <CreateDailyReport />
        ) : user?.role === "superAdmin" ? (
          <ShowDailyReports />
        ) : (
          <></>
        )}
      </Card>
    </>
  );
};

export default DailyReport;
