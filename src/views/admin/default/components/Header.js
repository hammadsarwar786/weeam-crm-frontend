import { Box } from "@chakra-ui/react";
import DashboardHeader from "../../../../assets/img/dashboard-header.jpeg"; 

const Header = () => {
  return (
    <>
      <Box mb={8} style={{
        backgroundImage: `url(${DashboardHeader})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundColor: "rgba(167, 111, 0, 0.5)", 
        backgroundBlendMode: 'overlay', 
        display: 'flex', 
        width: "100%"
      }} mt={"-15px"} h={270} w={"100%"} px={10} py={2} fontSize={42} flexDir={"column"} justifyContent={"flex-end"} color={"white"} fontWeight={"bold"}>
        <h1>Weeam</h1>
        <h1>CRM.</h1>
      </Box>
    </>
  );
};

export default Header;
