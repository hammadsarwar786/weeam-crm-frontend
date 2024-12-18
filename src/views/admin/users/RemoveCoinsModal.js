import { CloseIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
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
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userSchema } from "schema";
import { putApi } from "services/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/localSlice";
import { postApi } from "services/api";

const RemoveCoinsModal = (props) => {
  const { onClose, isOpen, fetchData, selectedUser, setDisplaySearchData } = props;

  const user = JSON.parse(window.localStorage.getItem("user"));
  const [isNegative, setIsNegative] = useState(false); 
  const tree = useSelector((state) => state.user);
  const initialValues = {
    coins: 0
  }; 
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      RemoveCoins();
      resetForm();
    },
  });


  const dispatch = useDispatch();
  
  const handleCloseModal = () => {
    onClose(); 
    // Dispatch setUser action to set user data
  };
  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
  } = formik;

  const [isLoding, setIsLoding] = useState(false);

  const handleInput = (e) => {
    handleChange(e); 
    if(Number(e.target.value) > (props.selectedUser?.coins || 0)) {
      setIsNegative(true); 
    } else {
      setIsNegative(false); 
    }
  }

  const RemoveCoins = async () => {
    try {
      setIsLoding(true);

      let response = await postApi(`api/user/removeCoins/${props.selectedUser?._id}`, {coins: values.coins});
      if (response && response.status === 200) {
        toast.success("Coins removed from the user!");         
        handleCloseModal();
        setDisplaySearchData(false); 
        fetchData();
        props?.setAction((pre) => !pre);

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
          Remove Coins
          <IconButton onClick={() => handleCloseModal()} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Number of Coins
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleInput}
                onBlur={handleBlur}
                value={values.coins}
                name="coins"
                type="number"
                placeholder="No. of coins"
                fontWeight="500"
                borderColor={
                  errors.coins && touched.coins ? "red.300" : null
                }
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.coins && touched.coins && errors.coins}
              </Text>
            </GridItem>
            </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="brand"
            disabled={isLoding ? true : (isNegative || !values.coins)}
            onClick={handleSubmit}
          >
            {isLoding ? <Spinner /> : "Remove"}
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            sx={{
              marginLeft: 2,
              textTransform: "capitalize",
            }}
            onClick={() => handleCloseModal()}
          >
            close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemoveCoinsModal;
