import { Printer } from "lucide-react";
import logo from "../assets/logo.png";

export default function BillReceipt({ bill }) {
  const printBill = () => {
    const medicines = Array.isArray(bill.medicines) ? bill.medicines : [];

    const receiptWindow = window.open("", "_blank");

    receiptWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - BILL-${bill.patient_id}</title>

  <style>
    *{
      margin:0;
      padding:0;
      box-sizing:border-box;
    }

    body{
      font-family:Arial,sans-serif;
      padding:35px;
      color:#111827;
    }

    .header{
      text-align:center;
      border-bottom:2px solid #2563eb;
      padding-bottom:20px;
      margin-bottom:25px;
    }

    .logo{
      width:110px;
      height:110px;
      border-radius:50%;
      border:4px solid #facc15;
      object-fit:cover;
      margin-bottom:12px;
    }

    .header h1{
      color:#2563eb;
      font-size:34px;
      margin-bottom:6px;
    }

    .header h3{
      color:#555;
      font-weight:500;
      margin-bottom:6px;
    }

    .header p{
      color:#666;
      font-size:15px;
    }

    .info p{
      margin:8px 0;
      font-size:16px;
    }

    table{
      width:100%;
      border-collapse:collapse;
      margin-top:18px;
    }

    th{
      background:#2563eb;
      color:white;
      padding:12px;
      border:1px solid #ddd;
    }

    td{
      padding:10px;
      border:1px solid #ddd;
    }

    .section{
      margin-top:30px;
    }

    .section h2{
      color:#2563eb;
      margin-bottom:10px;
      font-size:22px;
    }

    .center{
      text-align:center;
    }

    .right{
      text-align:right;
    }

    .total-box{
      margin-top:30px;
      text-align:right;
    }

    .total-box h2{
      color:#059669;
      font-size:34px;
    }

    .footer{
      margin-top:60px;
      text-align:center;
      color:#555;
      font-size:15px;
      border-top:1px solid #ddd;
      padding-top:15px;
    }
  </style>
</head>

<body>

  <!-- Header with Logo -->
  <div class="header">
    <img src="${logo}" class="logo" alt="Clinic Logo"/>

    <h1>Vasundhara Medical & Fancy Store</h1>

    

    <p>Dr.Gongura Nageswararo | Phone: 9908053880</p>
  </div>

  <!-- Patient Info -->
  <div class="info">
    <p><strong>Invoice :</strong> BILL-${bill.patient_id}</p>
    <p><strong>Date :</strong> ${new Date().toLocaleDateString("en-IN")}</p>
    <p><strong>Patient :</strong> ${bill.patient_name}</p>
    <p><strong>Patient ID :</strong> ${bill.patient_id}</p>
    <p><strong>Payment Mode :</strong> ${bill.payment_mode}</p>
  </div>

  <!-- Charges -->
  <table>
    <tr>
      <th>Description</th>
      <th>Amount</th>
    </tr>

    <tr>
      <td>Consultation Fee</td>
      <td>₹${bill.consultation_fee || 0}</td>
    </tr>

    <tr>
      <td>Medicine Charges</td>
      <td>₹${bill.medicine_fee || 0}</td>
    </tr>

    <tr>
      <td>Other Charges</td>
      <td>₹${bill.other_fee || 0}</td>
    </tr>
  </table>

  <!-- Medicines -->
  <div class="section">
    <h2>Medicines Included</h2>

    <table>
      <tr>
        <th>Medicine</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>

      ${
        medicines.length > 0
          ? medicines
              .map(
                (m) => `
        <tr>
          <td>${m.name || m.medicine_name || "Medicine"}</td>
          <td class="center">${m.qty || m.quantity || 1}</td>
          <td class="right">₹${m.price || 0}</td>
          <td class="right">₹${
            (m.price || 0) * (m.qty || m.quantity || 1)
          }</td>
        </tr>`
              )
              .join("")
          : `
        <tr>
          <td colspan="4" class="center">No Medicines Added</td>
        </tr>`
      }

      <tr>
        <td colspan="3" class="right"><strong>Medicine Total</strong></td>
        <td class="right"><strong>₹${bill.medicine_fee || 0}</strong></td>
      </tr>
    </table>
  </div>

  <!-- Total -->
  <div class="total-box">
    <h2>Total Amount : ₹${bill.total_amount || 0}</h2>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p><strong>Thank you for visiting Vasundhara Medical & Fancy Store.</strong></p>
    <p>Wishing you good health. Visit again!</p>
  </div>

</body>
</html>
    `);

    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
  };

  return (
    <button
      onClick={printBill}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
      <Printer size={18} />
      Print PDF
    </button>
  );
}