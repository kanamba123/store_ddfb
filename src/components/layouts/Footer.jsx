// components/Footer.jsx

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-500 py-4 border-t mt-auto">
      © {new Date().getFullYear()} MonDashboard. Tous droits réservés.
    </footer>
  );
}
