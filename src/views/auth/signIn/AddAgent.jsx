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
import { useDispatch } from "react-redux";
import { postApi } from "services/api";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../redux/localSlice";

const AddAgent = (props) => {
  const { onClose, isOpen } = props;
  const [isLoding, setIsLoding] = useState(false);

  const [show, setShow] = React.useState(false);
  const showPass = () => setShow(!show);

  const initialValues = {
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    password: "",
    nationality: "",
    dob: "",
    educationDegree: "",
    passportNum: "",
    uaeIdNum: "",
    dubaiHomeAddress: "",
    drivingLicense: "",
    countryHomeAddress: "",
    countryPhoneNum: "",
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const AddData = async () => {
    try {
      setIsLoding(true);
      const formValues = { ...values };

      formValues["parent"] = "6683996caf0978f7ab4976b6";
      formValues["role"] = "660ac718963404f9d1577481";
      formValues["roles"] = [];
      formValues["roles"][0] = "660ac718963404f9d1577481";

      let response = await postApi("api/user/register", formValues);
      if (response && response.status === 200) {
        toast.success("Account is successfuly created");

        navigate("/superAdmin");
        dispatch(setUser(response?.data?.user));
        onClose();
      } else {
        toast.error(response.response.data?.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <Modal size="2xl" isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="space-between" display="flex">
          Create account an agent account
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
                First Name
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                name="firstName"
                placeholder="firstName"
                fontWeight="500"
                borderColor={
                  errors.firstName && touched.firstName ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.firstName && touched.firstName && errors.firstName}
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
                Last Name
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
                name="lastName"
                placeholder="Last Name"
                fontWeight="500"
                borderColor={
                  errors.lastName && touched.lastName ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.lastName && touched.lastName && errors.lastName}
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
                Email
              </FormLabel>
              <Input
                fontSize="sm"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                name="username"
                placeholder="Email Address"
                fontWeight="500"
                borderColor={
                  errors.username && touched.username ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.username && touched.username && errors.username}
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
                Phone Number<Text color={"red"}>*</Text>
              </FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                />
                <Input
                  type="tel"
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phoneNumber}
                  name="phoneNumber"
                  fontWeight="500"
                  borderColor={
                    errors.phoneNumber && touched.phoneNumber ? "red.300" : null
                  }
                  placeholder="Phone number"
                  borderRadius="16px"
                />
              </InputGroup>
              <Text mb="10px" color={"red"}>
                {errors.phoneNumber &&
                  touched.phoneNumber &&
                  errors.phoneNumber}
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
                Password
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Enter Your Password"
                  name="password"
                  size="lg"
                  variant="auth"
                  type={show ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  borderColor={
                    errors.password && touched.password ? "red.300" : null
                  }
                  className={
                    errors.password && touched.password ? "isInvalid" : null
                  }
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={"gray.400"}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={showPass}
                  />
                </InputRightElement>
              </InputGroup>
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.password && touched.password && errors.password}
              </Text>
            </GridItem>
            {/* <GridItem colSpan={{ base: 12 }}>
    <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
      Employee PROFILE PHOTO
    </FormLabel>
    <Input
      type="file"
      fontSize="sm"
      onChange={handleChange}
      onBlur={handleBlur}
      name="profilePhoto"
      fontWeight="500"
    />
    <Text mb="10px" color={"red"}>
      {errors.profilePhoto && touched.profilePhoto && errors.profilePhoto}
    </Text>
  </GridItem> */}

            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Nationality
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.nationality}
                name="nationality"
                placeholder="Nationality"
                fontWeight="500"
                borderColor={
                  errors.nationality && touched.nationality ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.nationality &&
                  touched.nationality &&
                  errors.nationality}
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
                Date of Birth
              </FormLabel>
              <Input
                type="date"
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.dob}
                name="dob"
                fontWeight="500"
                borderColor={errors.dob && touched.dob ? "red.300" : null}
              />
              <Text mb="10px" color={"red"}>
                {errors.dob && touched.dob && errors.dob}
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
                Education Degree
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.educationDegree}
                name="educationDegree"
                placeholder="Education Degree"
                fontWeight="500"
                borderColor={
                  errors.educationDegree && touched.educationDegree
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.educationDegree &&
                  touched.educationDegree &&
                  errors.educationDegree}
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
                PASSPORT NUM
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.passportNum}
                name="passportNum"
                placeholder="PASSPORT NUM"
                fontWeight="500"
                borderColor={
                  errors.passportNum && touched.passportNum ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.passportNum &&
                  touched.passportNum &&
                  errors.passportNum}
              </Text>
            </GridItem>
            {/* <GridItem colSpan={{ base: 6 }}>
    <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
      PASSPORT PHOTO
    </FormLabel>
    <Input
      type="file"
      fontSize="sm"
      onChange={handleChange}
      onBlur={handleBlur}
      name="passportPhoto"
      fontWeight="500"
    />
    <Text mb="10px" color={"red"}>
      {errors.passportPhoto && touched.passportPhoto && errors.passportPhoto}
    </Text>
  </GridItem> */}
            <GridItem colSpan={{ base: 6 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                UEA ID NUM
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.uaeIdNum}
                name="uaeIdNum"
                placeholder="UEA ID NUM"
                fontWeight="500"
                borderColor={
                  errors.uaeIdNum && touched.uaeIdNum ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.uaeIdNum && touched.uaeIdNum && errors.uaeIdNum}
              </Text>
            </GridItem>
            {/* <GridItem colSpan={{ base: 6 }}>
    <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
      UEA ID PHOTO
    </FormLabel>
    <Input
      type="file"
      fontSize="sm"
      onChange={handleChange}
      onBlur={handleBlur}
      name="uaeIdPhoto"
      fontWeight="500"
    />
    <Text mb="10px" color={"red"}>
      {errors.uaeIdPhoto && touched.uaeIdPhoto && errors.uaeIdPhoto}
    </Text>
  </GridItem> */}

            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                DUBAI HOME Address
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.dubaiHomeAddress}
                name="dubaiHomeAddress"
                placeholder="Dubai Home Address"
                fontWeight="500"
                borderColor={
                  errors.dubaiHomeAddress && touched.dubaiHomeAddress
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.dubaiHomeAddress &&
                  touched.dubaiHomeAddress &&
                  errors.dubaiHomeAddress}
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
                Driving license
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.drivingLicense}
                name="drivingLicense"
                placeholder="Driving license"
                fontWeight="500"
                borderColor={
                  errors.drivingLicense && touched.drivingLicense
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.drivingLicense &&
                  touched.drivingLicense &&
                  errors.drivingLicense}
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
                Country home address
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.countryHomeAddress}
                name="countryHomeAddress"
                placeholder="Country Home Address"
                fontWeight="500"
                borderColor={
                  errors.countryHomeAddress && touched.countryHomeAddress
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.countryHomeAddress &&
                  touched.countryHomeAddress &&
                  errors.countryHomeAddress}
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
                COUNTRY PHONE NUM
              </FormLabel>
              <Input
                type="tel"
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.countryPhoneNum}
                name="countryPhoneNum"
                placeholder="Country Phone Number"
                fontWeight="500"
                borderColor={
                  errors.countryPhoneNum && touched.countryPhoneNum
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" color={"red"}>
                {errors.countryPhoneNum &&
                  touched.countryPhoneNum &&
                  errors.countryPhoneNum}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            disabled={isLoding ? true : false}
            onClick={handleSubmit}
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

export default AddAgent;
