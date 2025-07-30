import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 p-4">{children}</main>
      <Footer />
    </div>
  );
}
