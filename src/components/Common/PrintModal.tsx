import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: 'invoice' | 'quote' | 'light-wal' | 'pos-receipt' | 'payslip';
  data: any;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  docType,
  data
}) => {
  if (!isOpen || !data) return null;

  const company = StorageService.getCompanyInfo();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto">
      {/* Top action bar (hidden during print) */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl mb-4 no-print text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider">
            Document Print Preview: {docType.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document (A4 / Thermal)</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Paper Canvas (Styled cleanly in white for paper print) */}
      <div className="printable-area w-full max-w-3xl bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-12 min-h-[900px] flex flex-col justify-between border border-slate-200">
        
        {/* ==================================================== */}
        {/* DOCUMENT TYPE: COMMERCIAL INVOICE OR QUOTATION */}
        {/* ==================================================== */}
        {(docType === 'invoice' || docType === 'quote') && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                  {company.name.toUpperCase()}
                </h1>
                <div className="text-xs text-amber-700 font-bold mt-0.5">
                  {company.tagline}
                </div>
                <div className="text-xs text-slate-600 mt-1 max-w-md">
                  {company.address}
                </div>
                <div className="text-xs text-slate-600">
                  Tel: {company.phone1} | {company.phone2} • Email: {company.email}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-slate-950 text-white font-black text-base px-3 py-1 rounded">
                  {docType === 'invoice' ? 'COMMERCIAL INVOICE' : 'QUOTATION'}
                </span>
                <div className="text-xs font-mono font-bold text-slate-800 mt-2">
                  No: {data.bookingNumber || data.quoteNumber || 'LSL-DOC'}
                </div>
                <div className="text-xs text-slate-600">
                  Date: {data.createdAt || new Date().toISOString().split('T')[0]}
                </div>
                {docType === 'quote' && (
                  <div className="text-xs text-amber-700 font-semibold">
                    Valid Until: {data.validUntil}
                  </div>
                )}
              </div>
            </div>

            {/* Bill To & Event Details */}
            <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Bill To / Client:</span>
                <div className="text-sm font-bold text-slate-950">{data.customerName}</div>
                <div className="text-slate-700">Phone: {data.customerPhone}</div>
                {data.customerAddress && <div className="text-slate-600">Address: {data.customerAddress}</div>}
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Event & Schedule:</span>
                <div className="text-sm font-bold text-slate-950">{data.eventTitle}</div>
                <div className="text-slate-700">Venue: {data.eventVenue}</div>
                <div className="text-slate-700 mt-1 font-mono">
                  Event: {data.eventStartDate} to {data.eventEndDate} ({data.activeEventDays || 1} Days)
                </div>
                <div className="text-[11px] text-amber-800 font-semibold">
                  Blocked Window: {data.blockedStartDate} ➜ {data.blockedEndDate}
                </div>
              </div>
            </div>

            {/* Equipment Line Items Table */}
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-white uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Equipment Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Daily Rate</th>
                    <th className="py-2.5 px-3 text-center">Days</th>
                    <th className="py-2.5 px-3 text-right">Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {data.items?.map((item: any, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-950">{item.name}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">Rs. {item.dailyRate?.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{item.totalDays || 1}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        Rs. {item.subtotal?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Bank Details */}
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="text-xs space-y-2">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Direct Bank Transfer Details:</div>
                  <div className="text-slate-700">Bank: <strong>{company.bankName}</strong></div>
                  <div className="text-slate-700">Branch: {company.bankBranch}</div>
                  <div className="text-slate-900 font-mono font-bold">A/C: {company.accountNumber}</div>
                  <div className="text-slate-700">Account Name: {company.accountHolder}</div>
                </div>

                <div className="text-[10px] text-slate-500 leading-tight">
                  <strong className="text-slate-700">Terms & Conditions:</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    {company.terms.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Equipment Subtotal:</span>
                  <span className="font-mono">Rs. {data.equipmentTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Transport & Rigging Crew:</span>
                  <span className="font-mono">Rs. {data.transportCrewFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-mono">Rs. {data.securityDeposit?.toLocaleString()}</span>
                </div>
                {data.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount:</span>
                    <span className="font-mono">-Rs. {data.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-950 border-t-2 border-slate-900 pt-1">
                  <span>Net Contract Total:</span>
                  <span className="font-mono">Rs. {(data.netTotal || data.grandTotal)?.toLocaleString()}</span>
                </div>
                {docType === 'invoice' && (
                  <>
                    <div className="flex justify-between text-slate-700">
                      <span>Advance Received:</span>
                      <span className="font-mono text-emerald-700 font-bold">Rs. {data.advancePaid?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-rose-700 border-t border-slate-300 pt-1">
                      <span>Balance Due on Site:</span>
                      <span className="font-mono">Rs. {data.balanceDue?.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Signature Blocks */}
            <div className="grid grid-cols-2 gap-12 pt-12 text-center text-xs text-slate-600">
              <div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                  Client Acceptance / Signature
                </div>
                <div className="text-[10px] text-slate-400">Date: _______________</div>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-950">
                  For Lakshan Superlight Productions
                </div>
                <div className="text-[10px] text-slate-400">Authorized Signatory</div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* DOCUMENT TYPE: DEDICATED "LIGHT WAL" INVOICE */}
        {/* ==================================================== */}
        {docType === 'light-wal' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                  {company.name.toUpperCase()}
                </h1>
                <div className="text-xs text-amber-700 font-bold mt-0.5">
                  Dedicated "Light Wal" (Fairy / Festoon Lights) Invoicing & Workshop Sheet
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {company.address} • Tel: {company.phone1}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-amber-600 text-white font-black text-sm px-3 py-1 rounded">
                  LIGHT WAL INVOICE
                </span>
                <div className="text-xs font-mono font-bold text-slate-800 mt-2">
                  Order: {data.orderNumber}
                </div>
                <div className="text-xs text-slate-600">Date: {data.createdAt}</div>
                <div className="text-xs font-bold text-emerald-700">Delivery: {data.deliveryDate}</div>
              </div>
            </div>

            {/* Customer info */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between">
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Customer:</span>
                <div className="font-bold text-slate-950 text-sm">{data.customerName}</div>
                <div className="text-slate-700">Phone: {data.customerPhone}</div>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Status:</span>
                <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-xs">
                  {data.status}
                </span>
              </div>
            </div>

            {/* Technical Specifications for Assembly Workshop */}
            <div className="border border-slate-900 rounded-lg p-4 bg-amber-50/50 space-y-3">
              <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider border-b border-amber-200 pb-1">
                Workshop Custom Assembly Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Chain Length:</span>
                  <span className="font-bold text-slate-900 text-sm">{data.lengthValue} {data.lengthUnit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bulb Spacing:</span>
                  <span className="font-bold text-slate-900 text-sm">{data.bulbSpacingInches} Inches</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Sockets / Bulbs:</span>
                  <span className="font-black text-amber-800 text-sm">{data.calculatedBulbCount} Bulbs</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bulb Spec:</span>
                  <span className="font-semibold text-slate-900">{data.bulbType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Wire Insulation:</span>
                  <span className="font-semibold text-slate-900">{data.wireType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Plug & Controller:</span>
                  <span className="font-semibold text-slate-900">
                    {data.plugType} {data.controllerIncluded ? `+ ${data.controllerType}` : ''}
                  </span>
                </div>
              </div>

              {data.workshopNotes && (
                <div className="mt-2 text-xs bg-white p-2.5 rounded border border-amber-300 text-slate-800">
                  <span className="font-bold text-amber-800">Workshop & Packing Note: </span>
                  {data.workshopNotes}
                </div>
              )}
            </div>

            {/* Pricing details */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">Item / Pricing Structure</th>
                    <th className="p-2.5 text-center">Pricing Mode</th>
                    <th className="p-2.5 text-right">Unit Rate</th>
                    <th className="p-2.5 text-right">Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">
                      Custom Light Wal Set ({data.lengthValue} {data.lengthUnit}, {data.calculatedBulbCount} Bulbs)
                    </td>
                    <td className="p-2.5 text-center text-slate-600">{data.pricingMode}</td>
                    <td className="p-2.5 text-right font-mono">Rs. {data.ratePerUnit?.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono font-bold">
                      Rs. {(data.grandTotal - data.accessoriesFee + data.discount)?.toLocaleString()}
                    </td>
                  </tr>
                  {data.accessoriesFee > 0 && (
                    <tr>
                      <td className="p-2.5 text-slate-700">Spare Bulbs & Mounting Accessories</td>
                      <td className="p-2.5 text-center text-slate-600">Fixed</td>
                      <td className="p-2.5 text-right font-mono">--</td>
                      <td className="p-2.5 text-right font-mono">Rs. {data.accessoriesFee?.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial summary */}
            <div className="flex justify-between items-start text-xs pt-2">
              <div className="text-[10px] text-slate-500 max-w-sm">
                Each Light Wal chain is tested under load before delivery. Keep joints protected from direct water immersion unless outdoor heavy grade is specified.
              </div>
              <div className="space-y-1 text-right">
                <div className="text-sm font-black text-slate-900">
                  Grand Total: Rs. {data.grandTotal?.toLocaleString()}
                </div>
                <div className="text-slate-700 font-bold">
                  Advance Paid: Rs. {data.advancePaid?.toLocaleString()}
                </div>
                <div className="text-sm font-black text-rose-700">
                  Balance Due: Rs. {data.balanceDue?.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-10 text-center text-xs text-slate-600">
              <div className="border-t border-slate-400 pt-1">
                Workshop Assembly Technician Sign
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                Customer Acceptance Sign
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* DOCUMENT TYPE: POS THERMAL RECEIPT */}
        {/* ==================================================== */}
        {docType === 'pos-receipt' && (
          <div className="max-w-xs mx-auto font-mono text-xs space-y-3 text-slate-900 py-4">
            <div className="text-center space-y-0.5 border-b border-dashed border-slate-400 pb-3">
              <div className="font-black text-sm uppercase">{company.name}</div>
              <div className="text-[10px] text-slate-600">RETAIL DIRECT SALES</div>
              <div className="text-[10px]">{company.address}</div>
              <div className="text-[10px]">Tel: {company.phone1}</div>
              <div className="text-[10px] font-bold mt-1">RECEIPT: {data.receiptNumber}</div>
              <div className="text-[9px] text-slate-500">{new Date(data.date).toLocaleString()}</div>
            </div>

            <div className="border-b border-dashed border-slate-400 pb-2 space-y-1">
              {data.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <div>
                    <div>{item.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {item.quantity} x Rs. {item.retailPrice}
                    </div>
                  </div>
                  <div className="font-bold">Rs. {item.lineTotal?.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-400 pb-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {data.subtotal?.toLocaleString()}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-Rs. {data.discount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-400">
                <span>NET TOTAL:</span>
                <span>Rs. {data.netTotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment ({data.paymentMethod}):</span>
                <span>Rs. {data.amountPaid?.toLocaleString()}</span>
              </div>
              {data.changeGiven > 0 && (
                <div className="flex justify-between font-bold">
                  <span>Change Given:</span>
                  <span>Rs. {data.changeGiven?.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="text-center text-[10px] text-slate-600 pt-2">
              <div>Thank you for your purchase!</div>
              <div>Lakshan Superlight — Quality Guaranteed</div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* DOCUMENT TYPE: EMPLOYEE PAYSLIP */}
        {/* ==================================================== */}
        {docType === 'payslip' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h1 className="text-xl font-black text-slate-950 tracking-tight">
                  {company.name.toUpperCase()}
                </h1>
                <div className="text-xs text-purple-700 font-bold mt-0.5">
                  MONTHLY SALARY PAYSLIP
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {company.address}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-purple-700 text-white font-bold text-xs px-2.5 py-1 rounded">
                  {data.payrollMonth} PAYSLIP
                </span>
                <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                  Emp: {data.empName}
                </div>
                <div className="text-xs text-slate-600">Designation: {data.role}</div>
              </div>
            </div>

            {/* Attendance & work summary */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs grid grid-cols-3 gap-2">
              <div>
                <span className="text-slate-500 block">Days Worked:</span>
                <span className="font-bold text-slate-900">{data.daysWorked} Days</span>
              </div>
              <div>
                <span className="text-slate-500 block">Overtime (OT) Hours:</span>
                <span className="font-bold text-amber-800">{data.otHours} Hours</span>
              </div>
              <div>
                <span className="text-slate-500 block">Salary Type:</span>
                <span className="font-bold text-slate-900">{data.salaryType}</span>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-emerald-800 text-white font-bold px-3 py-1.5 uppercase text-[10px]">
                  Earnings (LKR)
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Basic Salary:</span>
                    <span className="font-mono font-bold">Rs. {data.basicSalary?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overtime ({data.otHours}h):</span>
                    <span className="font-mono font-bold">Rs. {data.otEarnings?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Site / Travel Allowances:</span>
                    <span className="font-mono font-bold">Rs. {data.siteAllowances?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 font-black text-slate-950">
                    <span>Gross Earnings:</span>
                    <span className="font-mono">Rs. {data.grossSalary?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-rose-800 text-white font-bold px-3 py-1.5 uppercase text-[10px]">
                  Deductions (LKR)
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <span>EPF Employee (8%):</span>
                    <span className="font-mono font-bold text-rose-700">Rs. {data.epfEmployee8?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salary Advance Taken:</span>
                    <span className="font-mono font-bold text-rose-700">Rs. {data.advanceDeductions?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 font-black text-slate-950">
                    <span>Total Deductions:</span>
                    <span className="font-mono text-rose-700">Rs. {data.totalDeductions?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary banner */}
            <div className="bg-slate-900 text-white p-4 rounded-lg flex justify-between items-center text-sm">
              <span className="font-bold">NET TAKE-HOME SALARY:</span>
              <span className="font-black text-xl text-amber-400 font-mono">
                Rs. {data.netSalary?.toLocaleString()}
              </span>
            </div>

            {/* Employer contributions */}
            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 flex justify-between">
              <span>Employer EPF Contribution (12%): <strong>Rs. {data.epfEmployer12?.toLocaleString()}</strong></span>
              <span>Employer ETF Contribution (3%): <strong>Rs. {data.etfEmployer3?.toLocaleString()}</strong></span>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-10 text-center text-xs text-slate-600">
              <div className="border-t border-slate-400 pt-1">
                Employer Signature / Stamp
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                Employee Signature (Received in Full)
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

