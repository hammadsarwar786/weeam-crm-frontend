import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Select,
  Button,
  Text,
  TableContainer,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { postApi } from "services/api";
import { toast } from "react-toastify";
import moment from "moment";
import ExcelJS from "exceljs";
import Card from "components/card/Card";

function LeadImport() {
  const location = useLocation();
  const { fileData } = location.state || {};
  const [importedFileFields, setImportedFileFields] = useState([]);
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [importedFileData, setImportedFileData] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const columns = [
    { Header: "Fields In Crm", accessor: "crmFields" },
    { Header: "Fields In File", accessor: "fileFields" },
  ];

  const fieldsInCrm = [
    {
      Header: "Lead Status",
      accessor: "leadStatus",
    },
    {
      Header: "Lead Source Channel",
      accessor: "leadSourceChannel",
    },
    {
      Header: "Lead Name",
      accessor: "leadName",
    },
    {
      Header: "Lead Email",
      accessor: "leadEmail",
    },
    {
      Header: "Lead Phone Number",
      accessor: "leadPhoneNumber",
    },
    {
      Header: "Lead Address",
      accessor: "leadAddress",
    },
    {
      Header: "Lead Score",
      accessor: "leadScore",
    },
    {
      Header: "Manager",
      accessor: "managerAssigned",
    },
    {
      Header: "Agent",
      accessor: "agentAssigned",
    },
    {
      Header: "Nationality",
      accessor: "nationality",
    },
    {
      Header: "Time to Call",
      accessor: "timetocall",
    },
    {
      Header: "Interest",
      accessor: "interest",
    },
    {
      Header: "Lead Whatsapp Number",
      accessor: "leadWhatsappNumber",
    },
    {
      Header: "Are You in UAE",
      accessor: "r_u_in_uae",
    },
    {
      Header: "Notes",
      accessor: "notes",
    },
    {
      Header: "IP",
      accessor: "ip",
    },
    {
      Header: "Page URL",
      accessor: "pageUrl",
    },
    {
      Header: "Lead Campaign",
      accessor: "leadCampaign",
    },
    {
      Header: "Lead Source",
      accessor: "leadSource",
    },
    {
      Header: "Lead Source Details",
      accessor: "leadSourceDetails",
    },
    {
      Header: "Lead Source Medium",
      accessor: "leadSourceMedium",
    },
    {
      Header: "Lead Source Campaign",
      accessor: "leadSourceCampaign",
    },
    {
      Header: "Lead Creation Date",
      accessor: "leadCreationDate",
    },
    {
      Header: "Lead Follow Up Date",
      accessor: "leadFollowUpDate",
    },
  ];

  const initialValues = {
    leadStatus: "new",
    leadSourceChannel: "",
    leadCampaign: "",
    leadSource: "",
    leadSourceDetails: null,
    leadSourceMedium: "",
    leadSourceReferral: null,
    leadSourceCampaign: null,
    leadFollowUpDate: "",
    leadConversionDate: "",
    leadCommunicationPreferences: "",
    leadName: "",
    leadEmail: "",
    leadPhoneNumber: "",
    leadAddress: "",
    leadScore: null,
    leadNurturingWorkflow: "",
    leadEngagementLevel: "",
    leadConversionRate: null,
    leadNurturingStage: "",
    leadNextAction: "",
    nationality: null,
    timetocall: null,
    interest: null,
    managerAssigned: "", 
    agentAssigned: "",
    leadWhatsappNumber: null,
    r_u_in_uae: null,
    notes: null,
    ip: null,
    pageUrl: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values, { resetForm }) => {
      const statuses = {
        Interested: "active",
        Sold: "sold",
        "Not interested": "pending",
        New: "new",
        "No Answer": "no_answer",
        Unreachable: "unreachable",
        Waiting: "waiting",
        "Follow Up": "follow_up",
        Meeting: "meeting",
        "Follow Up After Meeting": "follow_up_after_meeting",
        Deal: "deal",
        Junk: "junk",
        "Whatsapp Send": "whatsapp_send",
        "Whatsapp Rec": "whatsapp_rec",
        "Deal Out": "deal_out",
        "Shift Project": "shift_project",
        "Wrong Number": "wrong_number",
        Broker: "broker",
        "Voice Mail": "voice_mail",
        Request: "request",
      };
      const leadsData = importedFileData?.map((item, ind) => {
        const leadConversionDate = moment(
          item[values.leadConversionDate || "leadConversionDate"]
        );
        const leadFollowUpDate = moment(
          item[values.leadFollowUpDate || "leadFollowUpDate"]
        );
        const leadScore = item[values.leadScore || "leadScore"] || "";
        const leadConversionRate =
          item[values.leadConversionRate || "leadConversionRate"] || "";

        const obj = {
          leadName: item[values.leadName || "leadName"] || "",
          leadEmail: item[values.leadEmail || "leadEmail"] || "",
          leadPhoneNumber:
            item[values.leadPhoneNumber || "leadPhoneNumber"] || "",
          leadAddress: item[values.leadAddress || "leadAddress"] || "",
          leadScore: parseInt(leadScore, 10) || null,
          managerAssigned: item[values.managerAssigned || "managerAssigned"]?.trim() || "", 
          agentAssigned: item[values.agentAssigned || "agentAssigned"]?.trim() || "", 
          leadSource: item[values.leadSource || "leadSource"] || "",
          nationality: item[values.nationality || "nationality"] || "",
          timetocall: item[values.timetocall || "timetocall"] || "",
          interest: item[values.interest || "interest"] || "",
          leadWhatsappNumber:
            item[values.leadWhatsappNumber || "leadWhatsappNumber"] || "",
          r_u_in_uae: item[values.r_u_in_uae || "r_u_in_uae"] || "",
          notes: item[values.notes || "notes"] || "",
          ip: item[values.ip || "ip"] || "",
          pageUrl: item[values.pageUrl || "pageUrl"] || "",
          leadStatus: statuses[item[values.leadStatus || "leadStatus"]] || "new",
          leadSourceChannel:
            item[values.leadSourceChannel || "leadSourceChannel"] || "",
          leadConversionDate: leadConversionDate.isValid()
            ? item[values.leadConversionDate || "leadConversionDate"] || ""
            : "",
          leadFollowUpDate: leadFollowUpDate.isValid()
            ? item[values.leadFollowUpDate || "leadFollowUpDate"] || ""
            : "",
          leadCommunicationPreferences:
            item[
              values.leadCommunicationPreferences ||
                "leadCommunicationPreferences"
            ] || "",
          leadEngagementLevel:
            item[values.leadEngagementLevel || "leadEngagementLevel"] || "",
          leadConversionRate: parseFloat(leadConversionRate) || null,
          leadNurturingStage:
            item[values.leadNurturingStage || "leadNurturingStage"] || "",
          leadNextAction: item[values.leadNextAction || "leadNextAction"] || "",
          leadNurturingWorkflow:
            item[values.leadNurturingWorkflow || "leadNurturingWorkflow"] || "",
          leadCampaign: item[values.leadCampaign || "leadCampaign"] || "",
          leadSourceMedium:
            item[values.leadSourceMedium || "leadSourceMedium"] || "",
          leadSourceDetails:
            item[values.leadSourceDetails || "leadSourceDetails"] || "",
          createdDate: new Date(),
        };

        if(user?.role !== "superAdmin") {
          if (user?.roles[0]?.roleName === "Manager") {
            obj["managerAssigned"] = user?._id?.toString();
          } else if (user?.roles[0]?.roleName === "Agent") {
            obj["agentAssigned"] = user?._id?.toString();
            obj["managerAssigned"] = user?.parent?.toString();
          }
        }
        return obj;
      });

      AddData(leadsData);
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

  const AddData = async (leads) => {
    try {
      setIsLoding(true);
      let response = await postApi("api/lead/addMany", leads);
      if (response.status === 200) {
        toast.success(`Leads imported successfully`);
        resetForm();
        navigate("/lead");
      }
    } catch (e) {
      console.error(e);
      toast.error(`Leads import failed`);
      resetForm();
      navigate("/lead");
    } finally {
      setIsLoding(false);
    }
  };

  const parseFileData = async (file) => {
    const reader = new FileReader();
    const extension = file.name.split(".").pop().toLowerCase();

    reader.onload = async ({ target }) => {
      if (extension === "csv") {
        const csv = Papa.parse(target.result, {
          header: true,
        });
        const parsedData = csv?.data;

        if (parsedData && parsedData.length > 0) {
          setImportedFileData(parsedData);
          const fileHeadingFields = Object.keys(parsedData[0]);
          setImportedFileFields(fileHeadingFields);
        } else {
          toast.error("Empty or invalid CSV file");
          navigate("/lead");
        }
      } else if (extension === "xlsx") {
        const data = new Uint8Array(target.result);
        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(data);

        const worksheet = workbook.getWorksheet(1);
        const jsonData = [];

        // Iterate over rows and cells
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          const rowData = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            rowData[worksheet.getCell(1, colNumber).value] = cell.value;
          });
          jsonData.push(rowData);
        });
        jsonData?.splice(0, 1);
        setImportedFileData(jsonData);

        if (jsonData && jsonData.length > 0) {
          const fileHeadingFields = Object.keys(jsonData[0]);
          setImportedFileFields(fileHeadingFields);
        } else {
          toast.error("Empty or invalid XLSX file");
          navigate("/lead");
        }
      }
    };

    if (extension === "csv") {
      reader.readAsText(file);
    } else if (extension === "xlsx") {
      const blob = new Blob([file]);
      reader.readAsArrayBuffer(blob);
    }
  };

  useEffect(() => {
    if (fileData && fileData.length > 0) {
      const firstFile = fileData[0];
      parseFileData(firstFile);
    }
  }, [fileData]);

  const filterLead = importedFileFields.filter((field) =>
    fieldsInCrm.find((data) => field === data.accessor || field === data.Header)
  );

  return (
    <>
      <Card overflowY={"auto"} className="importTable">
        <Text
          color={"secondaryGray.900"}
          fontSize="22px"
          fontWeight="700"
          mb="20px"
        >
          Import Leads
        </Text>
        <Grid
          templateColumns="repeat(12, 1fr)"
          mb={3}
          pb={2}
          gap={1}
          borderBottom={"1px solid #e2e8f0"}
        >
          {columns.map((column, index) => (
            <GridItem
              key={index}
              colSpan={{ base: 6 }}
              fontWeight={"600"}
              fontSize={{ sm: "14px", lg: "14px" }}
              color="secondaryGray.900"
              style={{ textTransform: "uppercase" }}
            >
              {column.Header}
            </GridItem>
          ))}
        </Grid>
        <Grid
          templateColumns="repeat(12, 1fr)"
          mb={3}
          gap={1}
          overflowY={"auto"}
        >
          {fieldsInCrm?.map((item, index) => (
            <>
              <GridItem colSpan={{ base: 6 }} key={item.id} mt="10px">
                {item.Header}
              </GridItem>
              <GridItem colSpan={{ base: 4 }}>
                <Select
                  variant="flushed"
                  fontWeight="500"
                  isSearchable
                  value={values[item.accessor]}
                  name={item.accessor}
                  onChange={handleChange}
                >
                  <option value="">
                    {" "}
                    {filterLead
                      ? filterLead.find(
                          (data) =>
                            (item.Header === data || item.accessor === data) &&
                            data
                        )
                        ? filterLead.find(
                            (data) =>
                              (item.Header === data ||
                                item.accessor === data) &&
                              data
                          )
                        : "Select Field In File"
                      : "Select Field In File"}
                  </option>
                  {importedFileFields?.map((field) => (
                    <option value={field} key={field}>
                      {field}
                    </option>
                  ))}
                </Select>
              </GridItem>
            </>
          ))}
        </Grid>
        <Flex Flex justifyContent={"end"} mt="5">
          <Button
            disabled={isLoding}
            size="sm"
            onClick={() => handleSubmit()}
            variant="brand"
          >
            Next
          </Button>
        </Flex>
      </Card>
    </>
  );
}

export default LeadImport;
