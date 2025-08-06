

import { redirect } from 'next/navigation';
import WalletButton from './components/WalletButton';
import SearchButton from './components/SearchButton';


const page = () => {
  redirect('/login');
  return null;
}

export default page