import CustomerTable from "../components/CustomerTable";
import UploadExcel from "../components/UploadExcel";

export default function Home() {
  return (
    <div>
      <h1>Customer Management System</h1>
      <UploadExcel />
      <CustomerTable />
    </div>
  );
}