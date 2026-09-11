import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

export default function PrescriptionCard({ patient }) {

  const printPDF = () => {
    const doc = new jsPDF();

    // Convert logo image to Base64
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // ===== HEADER =====
      doc.addImage(img, "PNG", 80, 8, 50, 50);

      doc.setTextColor(37, 99, 235);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Vasundhara Medical & Fancy Store", 105, 65, {
        align: "center",
      });

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(13);
      doc.setFont("helvetica", "normal");
      doc.text("Clinic Management System", 105, 73, {
        align: "center",
      });

      doc.text(
        "Dr. Gongura Nageswararao (RMP) | Phone: 9908053880",
        105,
        81,
        { align: "center" }
      );

      // Blue Line
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(15, 88, 195, 88);

      // ===== PATIENT DETAILS =====
      let y = 98;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);

      doc.text(`Patient Name : ${patient.full_name}`, 20, y);
      y += 8;

      doc.text(`Age / Gender : ${patient.age} (${patient.gender})`, 20, y);
      y += 8;

      doc.text(`Phone Number : ${patient.phone}`, 20, y);
      y += 8;

      doc.text(`Date : ${new Date().toLocaleDateString("en-IN")}`, 20, y);
      y += 12;

      // Symptoms
      doc.setFont("helvetica", "bold");
      doc.text("Symptoms", 20, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      doc.text(patient.symptoms || "-", 20, y);
      y += 12;

      // Diagnosis
      doc.setFont("helvetica", "bold");
      doc.text("Diagnosis", 20, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      doc.text(patient.diagnosis || "-", 20, y);
      y += 12;

      // ===== MEDICINE TABLE =====
      autoTable(doc, {
        startY: y,
        head: [["Medicine", "Dosage", "Days"]],
        body:
          patient.medicines?.map((m) => [
            m.name,
            m.dosage,
            `${m.days} Days`,
          ]) || [],
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: 255,
          halign: "center",
        },
        bodyStyles: {
          halign: "center",
        },
      });

      y = doc.lastAutoTable.finalY + 12;

      // Doctor Advice
      doc.setFont("helvetica", "bold");
      doc.text("Doctor Advice", 20, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      doc.text(patient.doctor_notes || "-", 20, y);
      y += 12;

      // Follow-up
      doc.setFont("helvetica", "bold");
      doc.text(`Next Visit : ${patient.follow_up || "-"}`, 20, y);

      // Signature
      y += 28;
      doc.line(135, y, 190, y);
      doc.text("Dr. Gongura Nageswararao (RMP)", 140, y + 8);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(
        "Thank you for visiting Vasundhara Medical & Fancy Store.",
        105,
        288,
        { align: "center" }
      );

      doc.save(`${patient.full_name}-Prescription.pdf`);
    };
  };

  return (
    <button
      onClick={printPDF}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
    >
      Print Prescription PDF
    </button>
  );
}