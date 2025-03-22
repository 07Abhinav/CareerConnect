import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;