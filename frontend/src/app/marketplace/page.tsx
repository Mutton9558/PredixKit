import { redirect, useRouter } from 'next/navigation';
import WalletButtonWrapper from '../components/WalletButton';
import SearchButtonWrapper from '../components/SearchButton';
import PredictionCard from '../components/PredictionCard';
import { useEffect } from 'react';

const marketplace = () => {

  return (
    <div className='marketplace'>
      <header>
        <SearchButtonWrapper />
        <WalletButtonWrapper />
      </header>
      <div className="marketplace-container">
        <PredictionCard
          key={`past-${index}`}
          title={prediction.Title}
          predictionMoney={prediction.PredictionMoney}
          tag={prediction.Tag}
          id={prediction.id}
        />
      </div>
    </div>

  );
}

export default marketplace