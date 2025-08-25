import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import { LoaderProvider } from "../context/LoaderContext";
import AppWithLoader from "../components/AppWithLoader";

export const metadata = {
  title: "StepLux - Premium Footwear",
  description: "Buy premium shoes & sandals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoaderProvider>
          <CartProvider>
            <Navbar />
            <main>
              <AppWithLoader>{children}</AppWithLoader>
            </main>
            <Footer />
          </CartProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
