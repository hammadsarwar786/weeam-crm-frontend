import { Container, Flex, SimpleGrid, Text } from "@chakra-ui/react";

const ReportsGrid = ({data}) => {
    return  <SimpleGrid columns={{ base: 3 }} gap="20px" mb="20px">
          {!!data?.length && data?.map((report) => {
            return (
              <Container rounded={"lg"} position={"relative"} background={"#f0f0f0"} padding={3}>
                <p style={{marginBottom: 24}}>{report.text}</p>
                <Flex
                  color={"grey"}
                  position={"absolute"}
                  fontStyle={"italic"}
                  bottom={2}
                  right={2}
                  fontSize={15}
                  alignItems={"center"}
                  justifyContent={"flex-end"}
                >
                  {new Date(report.createdAt).toLocaleTimeString()}
                </Flex>
              </Container>
            );
          })}

          {data?.length === 0 && <Text fontSize={15} color={"red"}>No reports found</Text>}
        </SimpleGrid>
}

export default ReportsGrid;