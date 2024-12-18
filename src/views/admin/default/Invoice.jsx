import React from 'react';

const Invoice = () => {
  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <img src="logo.png" alt="Weam Elnaggar Real Estate" className="h-16" />
          <div className="text-right">
            <h2 className="text-2xl font-bold">Tax Invoice</h2>
            <p>Invoice Date: 07/08/2024</p>
            <p>Tax Invoice No: 17-18</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">WEAM ELNAGGAR REAL ESTATE</h3>
          <p>Office #3102, API World Tower, Sheikh Zayed road, Dubai, UAE</p>
          <p>Telephone: +971-56-657-7271 | +971-56-115-0747</p>
          <p>TRN : 104271009300003</p>
        </div>
        <div className="bg-gray-200 p-4 mb-6">
          <h3 className="text-lg font-semibold">Invoiced To</h3>
          <p>Azizi Developments LLC</p>
          <p>CONARD BUSINESS TOWER 1306 Dubai</p>
          <p>Dubai, UAE</p>
          <p>TRN : 104271009300003</p>
        </div>
        <table className="w-full mb-6 border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">SN</th>
              <th className="p-2 border">Unit No</th>
              <th className="p-2 border">Name of Referring Party</th>
              <th className="p-2 border">Claim Type</th>
              <th className="p-2 border">Commission %</th>
              <th className="p-2 border">Unit Price</th>
              <th className="p-2 border">Total Commission EXCL. vat</th>
              <th className="p-2 border">Vat %</th>
              <th className="p-2 border">Vat Amount</th>
              <th className="p-2 border">Total Commission include vat</th>
            </tr>
          </thead>
          <tbody>
            {Array(6).fill(null).map((_, index) => (
              <tr key={index}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">AZIZI VENICE 08B-736</td>
                <td className="p-2 border">WEAM ELNAGGAR REAL ESTATE</td>
                <td className="p-2 border">FULL</td>
                <td className="p-2 border">7%</td>
                <td className="p-2 border">6470000.00</td>
                <td className="p-2 border">452820.00</td>
                <td className="p-2 border">5%</td>
                <td className="p-2 border">22641.00</td>
                <td className="p-2 border">47554.50</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right mb-6">
          <p className="font-semibold">Total Commission: Two Hundred Twenty One Thousand Seven Hundred Seventy-Seven and Sixty fils.</p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-200 p-4">
            <h3 className="text-lg font-semibold">Bank Account Details:</h3>
            <p>Account Name: WEAM ELNAGGAR REAL Estate</p>
            <p>Account Number: 300253070000001</p>
            <p>MARYAH AL IBAN : AE0607300253070000001</p>
            <p>Swift Code : E097AEXXXXXX</p>
            <p>Bank : LLC BANK COMMUNITY</p>
            <p>Bank Address : AL BARSHA EMIRATES MALL DUBAI</p>
          </div>
          <div className="bg-gray-200 p-4">
            <h3 className="text-lg font-semibold">Invoice Summary:</h3>
            <p>Total Commission EXCL. VAT: 219,777.60 AED</p>
            <p>VAT Amount: 21345.60 AED</p>
            <p>Total Commission Include VAT: 899,777.60 AED</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
