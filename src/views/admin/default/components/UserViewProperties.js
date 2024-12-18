import { Box, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";

const UserViewProperties = ({ usersList }) => {
  const color = useColorModeValue("#eef1fa", "#202f66"); 
  const textcolor = useColorModeValue("black", "white"); 
  return (
    <SimpleGrid columns={{ base: 3 }} gap="20px" mb="20px" mt={"30px"}>
      {usersList?.map((user) => {
        return (
          <Box
          background={color}
            style={{
              borderRadius: 8,
              padding: 14,
            }}
          >
            <Text color={textcolor} style={{ marginBottom: 12 }}>
              {user?.firstName + " " + user?.lastName}
            </Text>
            <progress
              className="mini"
              value={100 * (user?.totalRevenue / user?.target)}
              max="100"
            ></progress>
            <Box 
            color={textcolor}

              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <small>{user?.totalRevenue}</small>
              <small>{user?.target}</small>
            </Box>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};

export default UserViewProperties;
