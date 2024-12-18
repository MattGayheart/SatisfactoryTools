import "./globals.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

export const metadata = {
  title: "Satisfactory Factory Planner",
  description: "Plan your factory layouts with ease!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = createTheme({
    /** Put your mantine theme override here */
  });
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
