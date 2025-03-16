import Header from './Header/Header';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-row h-screen">
      <Header />
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex-grow">{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
