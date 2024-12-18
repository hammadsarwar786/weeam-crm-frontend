import { CloseIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { userSchema } from "schema";
import { useSelector } from "react-redux";
import { getApi } from "services/api";
import { postApi } from "services/api";

const AddUser = (props) => {
  const { onClose, isOpen, setAction } = props;
  const [isLoding, setIsLoding] = useState(false);
  const [roles, setRoles] = useState([]);

  const tree = useSelector((state) => state.user);

  const initialValues = {
    trn: "", 
    developer_name: "", 
    address: "", 
    email :""
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm();
    },
  });
  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = formik;

 const AddData = async () => {
    try {
      setIsLoding(true);
      const formValues = { ...values };

      let response = await postApi(
        "api/developers",
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

  console.log(tree);

  return (
    <Modal size="2xl" isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="space-between" display="flex">
          Add Developer
          <IconButton onClick={onClose} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
          <Grid
            overflow={"scroll"}
            pr={"4"}
            templateColumns="repeat(12, 1fr)"
            gap={3}
          >
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                TRN 
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.trn}
                type="text"
                name="trn"
                placeholder="TRN"
                fontWeight="500"
                borderColor={
                  errors.trn && touched.trn ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.trn && touched.trn && errors.trn}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12, md:6 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Developer Name
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.developer_name}
                name="developer_name"
                placeholder="Developer Name"
                fontWeight="500"
                borderColor={
                  errors.developer_name && touched.developer_name ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.developer_name && touched.developer_name && errors.developer_name}
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 6, md: 6 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Email
              </FormLabel>
              <Input
                fontSize="sm"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                name="email"
                placeholder="Email Address"
                fontWeight="500"
                borderColor={
                  errors.email && touched.email ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.email && touched.email && errors.email}
              </Text>
            </GridItem>
       
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Address
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                name="address"
                placeholder="Address"
                fontWeight="500"
                borderColor={
                  errors.address && touched.address ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.address &&
                  touched.address &&
                  errors.address}
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
