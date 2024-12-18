import { position } from "@chakra-ui/system";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = (props) => {
  const { leadData } = props;

  let newLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "new" || lead?.leadStatus === "")?.length
      : 0;
  let activeLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "active")?.length
      : 0;
  let pendingLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "pending")?.length
      : 0;
  let reassignedLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "reassigned")?.length
      : 0;
  let soldLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "sold")?.length
      : 0;
  let noAnswerLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "no_answer")?.length
      : 0;
  let unreachableLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "unreachable")?.length
      : 0;
  let waitingLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "waiting")?.length
      : 0;
        let followUpLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "follow_up")?.length
      : 0;
        let meetingLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "meeting")?.length
      : 0;
        let followUpAfterMeetingLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "follow_up_after_meeting")?.length
      : 0;
        let dealLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "deal")?.length
      : 0;
        let junkLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "junk")?.length
      : 0;
        let whatsappSendLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "whatsapp_send")?.length
      : 0;
        let whatsappRecLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "whatsapp_rec")?.length
      : 0;
        let dealOutLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "deal_out")?.length
      : 0;
        let shiftProjectLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "shift_project")?.length
      : 0;
        let wrongNumberLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "wrong_number")?.length
      : 0;
        let brokerLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "broker")?.length
      : 0;
        let voiceMailLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "voice_mail")?.length
      : 0;
        let requestLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "request")?.length
      : 0;
  const series = [
    newLength,
    activeLength,
    pendingLength,
    reassignedLength,
    soldLength,
    noAnswerLength,
    unreachableLength,

    waitingLength, 
    followUpLength, 
    dealLength, 
    junkLength, 
    voiceMailLength, 
    brokerLength, 
    requestLength, 
    dealOutLength, 
    whatsappSendLength, 
    whatsappRecLength, 
    meetingLength, 
    followUpAfterMeetingLength, 
    wrongNumberLength, 
    shiftProjectLength
  ];
  const scaledSeries = series.map((value) =>
    leadData?.length ? (value * 100) / leadData?.length : 0
  );
  const options = {
    chart: {
      type: "pie",
      width: 330,
    },
    legend: {
      show: false, 
      floating: true, 
    },
    stroke: {
      lineCap: "round",
    },
    colors: ["#B79045"],
    series: scaledSeries,
  
    labels: [
      "New",
      "Interested",
      "Not interested",
      "Reassigned",
      "Sold",
      "No Answer",
      "Unreachable",
      "Waiting", 
      "Follow Up", 
      "Deal", 
      "Junk", 
      "Voice mail", 
      "Broker", 
      "Request", 
      "Deal Out", 
      "Whatsapp Send", 
      "Whatsapp Rec", 
      "Meeting", 
      "Follow Up after Meeting", 
      "Wrong Number", 
      "Shift Project"
    ],
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        type="pie"
        series={scaledSeries}
        height={320}
      />
    </div>
  );
};

export default ApexChart;
