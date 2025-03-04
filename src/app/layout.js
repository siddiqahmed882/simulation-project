import './globals.css';
import { Inter } from 'next/font/google';
import Container from '@mui/material/Container';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Simulator',
  description: 'Multi Server Simulation',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <nav className='bg-gray-800 text-white p-4'>
          <Container maxWidth='lg'>
            <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-bold'>Simulator</h1>
              <div>
                <a href='/mgc' className='text-white hover:underline'>
                  M/G/C
                </a>
                <span className='mx-2'>|</span>
                <a href='/mmc' className='text-white hover:underline'>
                  M/M/C
                </a>
              </div>
            </div>
          </Container>
        </nav>
        <Container maxWidth='lg'>{children}</Container>
      </body>
    </html>
  );
}
