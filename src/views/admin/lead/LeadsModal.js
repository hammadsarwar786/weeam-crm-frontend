import { Box, Modal, ModalContent, ModalOverlay, ModalCloseButton } from '@chakra-ui/react';
import View from "./View"; 

const LeadsModal = ({leadsModal, onClose,reFreshData}) => {

    return (
        <div>
            <Modal onClose={onClose} isOpen={leadsModal.isOpen} isCentered>
                <ModalOverlay />
                <ModalContent overflowY="scroll" height={"90vh"} style={{maxWidth: "90vw"}}>
                                    <ModalCloseButton/>

                    <Box p={4} pt={16}>
                        <View param={{id: leadsModal.lid}} reFreshData={reFreshData}/>
                    </Box> 
                </ModalContent>
            </Modal>
        </div>
    )
}

export default LeadsModal; 
