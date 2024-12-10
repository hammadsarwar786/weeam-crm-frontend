import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userSchema } from "schema";
import { getApi } from "services/api";
import { postApi } from "services/api";

const AddUser = (props) => {
  const { onClose, isOpen, setAction } = props;
  const [isLoding, setIsLoding] = useState(false);
  const [roles, setRoles] = useState([]);

  const initialValues = {
    account_holder_name: "",
    branch_address: "",
    account_number: "",
    swift_code: "",
    bank_name: "",
    iban: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,
    onSubmit: (values, { resetForm }) => {
      AddData();
      resetForm();
    },
  });
  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    formik;

  const AddData = async () => {
    try {
      setIsLoding(true);
      const formValues = { ...values };

      let response = await postApi(
        "api/bank_accounts",
        formValues,
        false,
        "server2"
      );
      if (response && response.status === 200) {
        props.onClose();
        setAction((pre) => !pre);
      } else {
        toast.error(response.response.data?.message);
      }
    } catch (e) {
      console.log(e);
        toast.error("Something went wrong!");
    } finally {
      setIsLoding(false);
    }
  };

  const fetchRoles = async () => {
    let result = await getApi("api/role-access");
    setRoles(result.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <Modal size="2xl" isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="space-between" display="flex">
          Add Bank Account
          <IconButton onClick={onClose} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
          <Grid
            h={"60vh"}
            overflow={"scroll"}
            pr={"4"}
            templateColumns="repeat(12, 1fr)"
            gap={3}
          >
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Account Holder Name
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.account_holder_name}
                name="account_holder_name"
                placeholder="Account Holder Name"
                fontWeight="500"
                borderColor={
                  errors.account_holder_name && touched.account_holder_name
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.account_holder_name &&
                  touched.account_holder_name &&
                  errors.account_holder_name}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Account Number
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.account_number}
                type="number"
                name="account_number"
                placeholder="Account Number"
                fontWeight="500"
                borderColor={
                  errors.account_number && touched.account_number
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.account_number &&
                  touched.account_number &&
                  errors.account_number}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 6 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                IBAN
              </FormLabel>
              <Input
                fontSize="sm"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.iban}
                name="iban"
                placeholder="IBAN"
                fontWeight="500"
                borderColor={errors.iban && touched.iban ? "red.300" : null}
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.iban && touched.iban && errors.iban}
              </Text>
            </GridItem>

            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Swift Code
              </FormLabel>
              <Input
                fontSize={"sm"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.nationality}
                name="swift_code"
                placeholder="Swift Code"
                fontWeight="500"
                borderColor={
                  errors.swift_code && touched.swift_code ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.swift_code && touched.swift_code && errors.swift_code}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 6 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Bank Name
              </FormLabel>
              <Input
                type="text"
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.bank_name}
                name="bank_name"
                placeholder="Bank Name"
                fontWeight="500"
                borderColor={
                  errors.bank_name && touched.bank_name ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.bank_name && touched.bank_name && errors.bank_name}
              </Text>
            </GridItem>

            <GridItem colSpan={{ base: 6 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Bank Address
              </FormLabel>
              <Input
                type="text"
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.branch_address}
                name="branch_address"
                placeholder="Bank Address"
                fontWeight="500"
                borderColor={
                  errors.branch_address && touched.branch_address
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.branch_address &&
                  touched.branch_address &&
                  errors.branch_address}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            disabled={isLoding ? true : false}
            onClick={AddData}
          >
            {isLoding ? <Spinner /> : "Save"}
          </Button>
          <Button
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUser;
