import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  GridItem,
  IconButton,
  Input,
  Select,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { postApi } from "services/api";
import { generateValidationSchema } from "utils";
import * as yup from "yup";

const Add = (props) => {
  const [isLoding, setIsLoding] = useState(false);
  const initialFieldValues = Object.fromEntries(
    (props?.leadData?.fields || []).map((field) => [field?.name, ""])
  );

  const initialValues = {
    ...initialFieldValues,
    createBy: JSON.parse(localStorage.getItem("user"))._id,
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: validationSchema,
    validationSchema: yup
      .object()
      .shape(generateValidationSchema(props?.leadData?.fields)),
    onSubmit: (values, { resetForm }) => {
      AddData();
    },
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = formik;

  const AddData = async () => {
    try {
      setIsLoding(true);

      const formValues = { ...values };
      if (user?.roles[0]?.roleName === "Manager") {
        formValues["managerAssigned"] = user?._id?.toString();
      }

      if (user?.roles[0]?.roleName === "Agent") {
        formValues["agentAssigned"] = user?._id?.toString();
      }
      // let response = await postApi('api/lead/add', values)
      formValues["leadStatus"] = "new";
      let response = await postApi("api/form/add", {
        ...formValues,
        moduleId: props?.leadData?._id,
      });
      if (response.status === 200) {
        props.onClose();
        formik.resetForm();
        props.fetchData();
        props.setAction((pre) => !pre);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    props.onClose();
  };

  return (
    <div>
      <Drawer isOpen={props.isOpen} size={props.size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader justifyContent="space-between" display="flex">
            Add invoice
            <IconButton onClick={props.onClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody>
         
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Input
                  fontSize="sm"
                  type={"text"}
                  name={"unitNo"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values["unitNo"]}
                  fontWeight="500"
                  placeholder={`Enter Unit No`}
                  borderColor={
                    errors?.["unitNo"] && touched?.["unitNo"] ? "red.300" : null
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Select
                  fontSize="sm"
                  name={"developer"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Select developer"
                  value={values["developer"] || null}
                  fontWeight="500"
                  borderColor={
                    errors?.["developer"] && touched?.["developer"]
                      ? "red.300"
                      : null
                  }
                ></Select>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Input
                  fontSize="sm"
                  type={"number"}
                  name={"totalPrice"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values["totalPrice"]}
                  fontWeight="500"
                  placeholder={`Enter Total Price`}
                  borderColor={
                    errors?.["totalPrice"] && touched?.["totalPrice"] ? "red.300" : null
                  }
                />
              </GridItem>
            </Grid>
          </DrawerBody>
          <DrawerFooter>
            <Button
              sx={{ textTransform: "capitalize" }}
              size="sm"
              disabled={isLoding ? true : false}
              variant="brand"
              type="submit"
              onClick={handleSubmit}
            >
              {isLoding ? <Spinner /> : "Save"}
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              onClick={handleCancel}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Add;
