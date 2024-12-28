import SearchBox from '@/components/SearchBox';

export const metadata = {
  title: 'Mercado Libre Challenge',
  description: 'Buscador de productos de Mercado Libre',
};

export default function Home() {
  return (
    <main>
      <SearchBox />
    </main>
  );
}