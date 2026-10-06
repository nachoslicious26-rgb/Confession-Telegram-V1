export const metadata = {
  title: 'Admin Confession Dashboard',
  description: 'Sistem Tapisan Confession Universiti',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f4f4f5' }}>
        {children}
      </body>
    </html>
  );
}
