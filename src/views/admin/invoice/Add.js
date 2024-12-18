import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Select,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import { postApi } from "services/api";
import { generateValidationSchema } from "utils";
import * as yup from "yup";

const Add = (props) => {
  const [isLoding, setIsLoding] = useState(false);
  const [developersData, setDevelopersData] = useState([]); 
  const [bankAccountsData, setBankAccountsData] = useState([]); 
  const [developersLoading, setDevelopersLoading] = useState([]); 
  const [bankAccountsLoading, setBankAccountsLoading] = useState([]); 
 

  const initialValues = {
    unit_no: null, 
    invoice_number: null, 
    total_amount: 0, 
    developer_id: null, 
    bank_account_id: null
  };

  const formik = useFormik({
    initialValues: initialValues,
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
  } = formik;

  
  const AddData = async () => {
    try {
      setIsLoding(true);
      const formValues = { ...values };

      let response = await postApi(
        "api/invoices",
        formValues,
        false,
        "server2"
      );
      if (response && response.status === 200) {
        props.onClose();
      } else {
        toast.error(response.response.data?.message);
      }
    } catch (e) {
      console.log(e);
        toast.error("Something went wrong!");
    } finally {
      setIsLoding(false);
    }
  }

  const handleCancel = () => {
    formik.resetForm();
    props.onClose();
  };

  const fetchDevelopers = async () => {
    setDevelopersLoading(true);
    let result = await getApi(
         `api/developers`, null, "server2"
    );
    setDevelopersData(result.data || []);
    setDevelopersLoading(false);
  };

  const fetchBankAccounts = async () => {
    setBankAccountsLoading(true);
    let result = await getApi(`api/bank_accounts`, null, "server2");
    setBankAccountsData(result.data || []);
    setBankAccountsLoading(false);
  };

  useEffect(() => {
    fetchDevelopers();
    fetchBankAccounts();
  }, []); 

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
              <FormLabel>Unit No</FormLabel>
                <Input
                  fontSize="sm"
                  type={"number"}
                  name={"unit_no"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values["unit_no"]}
                  fontWeight="500"
                  placeholder={`Enter Unit No`}
                  borderColor={
                    errors?.["unit_no"] && touched?.["unit_no"] ? "red.300" : null
                  }
                />
              </GridItem>
               <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormLabel>Unit No</FormLabel>
                <Input
                  fontSize="sm"
                  type={"text"}
                  name={"invoice_number"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values["invoice_number"]}
                  fontWeight="500"
                  placeholder={`Enter Invoice Number`}
                  borderColor={
                    errors?.["invoice_number"] && touched?.["invoice_number"] ? "red.300" : null
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormLabel>Total Price</FormLabel>
                <Input
                  fontSize="sm"
                  type={"number"}
                  name={"total_amount"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values["total_amount"]}
                  fontWeight="500"
                  placeholder={`Enter Total Amount`}
                  borderColor={
                    errors?.["total_amount"] && touched?.["total_amount"] ? "red.300" : null
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormLabel>Developer</FormLabel>
                  
                <Select
                  fontSize="sm"
                  name={"developer_id"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Select developer"
                  value={values["developer_id"] || null}
                  fontWeight="500"
                  disabled={developersLoading}
                  borderColor={
                    errors?.["developer_id"] && touched?.["developer_id"]
                      ? "red.300"
                      : null
                  }
                >
                  {developersData.map((developer) => {
                    return <option value={developer.id}>{developer.developer_name}</option>
                  })}
                </Select>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
              
              <FormLabel>Bank Account</FormLabel>
                <Select
                  fontSize="sm"
                  name={"bank_account_id"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={bankAccountsLoading}
                  placeholder="Select bank account"
                  value={values["bank_account_id"] || null}
                  fontWeight="500"
                  borderColor={
                    errors?.["bank_account_id"] && touched?.["bank_account_id"]
                      ? "red.300"
                      : null
                  }
                >

                  {bankAccountsData.map((bankAccount) => {
                    return <option value={bankAccount.id}>{bankAccount.account_holder_name}</option>
                  })}

                </Select>
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
              onClick={AddData}
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
