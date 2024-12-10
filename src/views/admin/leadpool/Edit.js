import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, FormLabel, Grid, GridItem, Heading, IconButton, Input, InputGroup, InputLeftElement, Select, Text } from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { leadSchema } from 'schema';
import { putApi } from 'services/api';
import { getApi } from 'services/api';
import { generateValidationSchema } from '../../../utils';
import CustomForm from '../../../utils/customForm';
import * as yup from 'yup'
import { useSelector } from "react-redux";


const comments  =  [
    {
        note:"Hello there how are you",
        time:"15/07/2024  17:30:40"
    },
    {
        note:"another note",
        time:"15/07/2024  17:30:40"
    },
    {
        note:"comment by manager",
        time:"15/07/2024  17:30:40"
    },
    {
        note:"Hello there how are you",
        time:"15/07/2024  17:30:40"
    },
    {
        note:"Hello there how are you",
        time:"15/07/2024  17:30:40"
    },
    {
        note:"Hello there how are you",
        time:"15/07/2024  17:30:40"
    },
]

const Edit = (props) => {
    const [isLoding, setIsLoding] = useState(false);
    const initialFieldValues = Object.fromEntries(
        (props?.leadData?.fields || []).map(field => [field?.name, ''])
    );
    const tree = useSelector((state) => state.user.tree);
    // const [initialValues, setInitialValues] = useState({
    //     // Lead Information:
    //     leadName: '',
    //     leadEmail: '',
    //     leadPhoneNumber: '',
    //     leadAddress: '',
    //     // Lead Source and Details:
    //     leadSource: '',
    //     leadStatus: '',
    //     leadSourceDetails: '',
    //     leadCampaign: '',
    //     leadSourceChannel: '',
    //     leadSourceMedium: '',
    //     leadSourceCampaign: '',
    //     leadSourceReferral: '',
    //     // Lead Assignment and Ownership:
    //     leadAssignedAgent: '',
    //     leadOwner: '',
    //     leadCommunicationPreferences: '',
    //     // Lead Dates and Follow-up:
    //     leadCreationDate: '',
    //     leadConversionDate: '',
    //     leadFollowUpDate: '',
    //     leadFollowUpStatus: '',
    //     // Lead Scoring and Nurturing:
    //     leadScore: '',
    //     leadNurturingWorkflow: '',
    //     leadEngagementLevel: '',
    //     leadConversionRate: '',
    //     leadNurturingStage: '',
    //     leadNextAction: '',
    //     createBy: JSON.parse(localStorage.getItem('user'))._id,
    // });
    const [initialValues, setInitialValues] = useState({
        ...initialFieldValues,
        createBy: JSON.parse(localStorage.getItem('user'))._id
    })
    const param = useParams()

    const getManagerNameById = (id) =>{
      const manager =  tree?.managers?.find(manager=>{
            return manager?._id == values?.managerAssigned  ;  
    });

    return manager?.firstName + " " + manager?.lastName

    }


    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        // validationSchema: leadSchema,
        validationSchema: yup.object().shape(generateValidationSchema(props?.leadData?.fields)),
        onSubmit: (values, { resetForm }) => {
            EditData();
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const EditData = async () => {
        try {
            setIsLoding(true)
            // let response = await putApi(`api/lead/edit/${props?.selectedId || param.id}`, values)
            let response = await putApi(`api/form/edit/${props?.selectedId || param.id}`, { ...values, moduleId: props.moduleId })
            if (response.status === 200) {
                props.onClose();
                props.setAction((pre) => !pre)
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    const handleClose = () => {
        props.onClose(false)
        props.setSelectedId && props?.setSelectedId()
        formik.resetForm();
    }

    let response
    const fetchData = async () => {
        if (props?.selectedId || param.id) {
            try {
                setIsLoding(true)
                response = await getApi('api/lead/view/', props?.selectedId ? props?.selectedId : param.id)
                let editData = response?.data?.lead
                editData.leadCreationDate = moment(response?.data?.lead?.leadCreationDate).format('YYYY-MM-DD');
                editData.leadConversionDate = moment(response?.data?.lead?.leadConversionDate).format('YYYY-MM-DD');
                editData.leadFollowUpDate = moment(response?.data?.lead?.leadFollowUpDate).format('YYYY-MM-DD');
                setInitialValues(editData)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoding(false)
            }
        }
    }

    useEffect(() => {
        fetchData()

    }, [props?.selectedId])
    console.log("My lead Data",props.leaddata)
    return (
        <div>
            <Drawer isOpen={props.isOpen} size={props.size}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader justifyContent='space-between' display='flex' >
                        Lead Details
                        <IconButton onClick={handleClose} icon={<CloseIcon />} />
                    </DrawerHeader>
                    <DrawerBody>

                        {isLoding ?
                            <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                                <Spinner />
                            </Flex>
                            :
                           

                    
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                <GridItem colSpan={{ base: 12 }}>
                                    <Heading as="h1" size="md" >
                                        Personal Details
                                    </Heading>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Lead Name
                                    </FormLabel>
                                    <Input
                                        disabled
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadName}
                                        name="leadName"
                                        placeholder='Enter Lead Name'
                                        fontWeight='500'
                                        borderColor={errors.leadName && touched.leadName ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}> {errors.leadName && touched.leadName && errors.leadName}</Text>
                                
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Nationality
                                    </FormLabel>
                                    <Input
                                        disabled
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.nationality}
                                        name="leadAddress"
                                        placeholder='Enter Lead Address'
                                        fontWeight='500'
                                        borderColor={errors.leadAddress && touched.leadAddress ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadAddress && touched.leadAddress && errors.leadAddress}</Text>
                                </GridItem>
                                
                                <GridItem colSpan={{ base: 12, sm: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Interest
                                    </FormLabel>
                                    <Input
                                        disabled
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.interest}
                                        name="leadSource"
                                        placeholder='Enter Lead Source'
                                        fontWeight='500'
                                        borderColor={errors.leadSource && touched.leadSource ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadSource && touched.leadSource && errors.leadSource}</Text>
                                </GridItem>
                               { (values.leadPhoneNumber || values.leadEmail) &&   <>
                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        Contact Details
                                    </Heading>
                                </GridItem>

                         <GridItem colSpan={{ base: 12, sm: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Phone No
                                    </FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                        />
                                        <Input
                                            disabled
                                            type="tel"
                                            fontSize='sm'
                                            onChange={handleChange} onBlur={handleBlur}
                                            value={values.leadPhoneNumber}
                                            name="leadPhoneNumber"
                                            fontWeight='500'
                                            borderColor={errors.title && touched.title ? "red.300" : null}
                                            placeholder="Phone number" borderRadius="16px" />
                                    </InputGroup>
                                    <Text mb='10px' color={'red'}>{errors.leadPhoneNumber && touched.leadPhoneNumber && errors.leadPhoneNumber}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, sm: 12 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                         Email Address
                                    </FormLabel>
                                    <Input
                                        disabled
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={values.leadEmail}
                                        type='email'
                                        name="leadEmail"
                                        placeholder='mail@simmmple.com'
                                        fontWeight='500'
                                        borderColor={errors.leadEmail && touched.leadEmail ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadEmail && touched.leadEmail && errors.leadEmail}</Text>
                                </GridItem></> }
                                 

                                <GridItem colSpan={{ base: 12 }}>
                                    <HSeparator />
                                    <Heading mt={2} as="h1" size="md" >
                                        Lead Info
                                    </Heading>
                                </GridItem>
                                
                                
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Assign to
                                    </FormLabel>
                                    <Input
                                        disabled
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={getManagerNameById(values?.managerAssigned)}
                                        name="leadSourceDetails"

                                        placeholder='Enter Lead Source Details'
                                        fontWeight='500'
                                        borderColor={errors.leadSourceDetails && touched.leadSourceDetails ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadSourceDetails && touched.leadSourceDetails && errors.leadSourceDetails}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 6 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Approved By
                                    </FormLabel>
                                    <Input
                                        disabled
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        value={getManagerNameById(values?.managerAssigned)}
                                        name="leadCampaign"
                                        placeholder='Enter Lead Campaign'
                                        fontWeight='500'
                                        borderColor={errors.leadCampaign && touched.leadCampaign ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadCampaign && touched.leadCampaign && errors.leadCampaign}</Text>
                                </GridItem>
                                { (values.leadPhoneNumber && values.leadEmail) &&    <GridItem colSpan={{ base: 12, sm: 12 }}>
                                    <Button
                            sx={{ textTransform: "capitalize",width:"100%" }}
                            variant="brand" size="lg"
                            type="submit"
                            disabled={isLoding ? true : false}
                            onClick={handleSubmit}
                        >
                           Send Request
                        </Button>
                        <Text sx={{textAlign:"center",margin:"5px 0px"}}>Send request to get access to contact details</Text>
                        </GridItem>
                                }
                                <GridItem colSpan={{ base: 12, sm: 10 }}>
                                    <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Comments
                                    </FormLabel>
                                    <Input
                                        
                                        fontSize='sm'
                                        onChange={handleChange} onBlur={handleBlur}
                                        // value={values}
                                        name="leadCampaign"
                                        placeholder='Type here...'
                                        fontWeight='500'
                                        borderColor={errors.leadCampaign && touched.leadCampaign ? "red.300" : null}
                                    />
                                    <Text mb='10px' color={'red'}>{errors.leadCampaign && touched.leadCampaign && errors.leadCampaign}</Text>
                          
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 2 }}>
                                <FormLabel visibility="hidden" display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                        Text
                                    </FormLabel>
                                 <Button
                            sx={{ textTransform: "capitalize" }}
                            variant="brand" size="sm"
                            type="submit"
                            disabled={isLoding ? true : false}
                            onClick={handleSubmit}
                        >
                            {isLoding ? <Spinner /> : 'Update'}
                        </Button>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, sm: 11 }}>
                                   {
                                    comments?.map((comment)=>{
                                   return <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><Text >{comment?.note}</Text><Text>{comment?.time}</Text></div>
                                    })
                                   }
                                    
                          
                                </GridItem>
                                
                                
                            </Grid> 

                        }
                            </DrawerBody>

                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default Edit