import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useState } from "react";
import { postApi } from "services/api";
import { toast } from "react-toastify";
import { Textarea } from "@chakra-ui/react";

const NewNoteModal = ({ setNoteAdded, onClose, isOpen, paramId }) => {
  const [noteValue, setNoteValue] = useState("");
  const [isLoding, setIsLoding] = useState(false);

  const handleAddNote = async () => {
    if (noteValue.trim()) {
      try {
        setIsLoding(true);
        await postApi("api/leadnote", {
          leadID: paramId,
          note: noteValue,
        });
        toast.success("Note added successfuly");
        setNoteAdded((noteAdded) => (noteAdded === 0 ? 1 : 0));
        setNoteValue("");
        onClose();
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
      setIsLoding(false);
    }
  };

  return (
    <div>
      <Modal size="2xl" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
            style={{
                whiteSpace: "pre-wrap"
            }}
            size={"md"}
            rows={5}
              value={noteValue}
              onInput={(e) => setNoteValue(e.target.value)}
              mr={3}
              placeholder="Type here"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="brand"
              size="sm"
              mr={2}
              onClick={handleAddNote}
              disabled={isLoding ? true : false}
            >
              {isLoding ? <Spinner /> : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NewNoteModal;
