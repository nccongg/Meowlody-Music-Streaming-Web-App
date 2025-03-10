import Header from './Header/Header';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default DefaultLayout;
