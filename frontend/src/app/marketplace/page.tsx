import { redirect } from 'next/navigation';
import WalletButtonWrapper from '../components/WalletButton';
import SearchButtonWrapper from '../components/SearchButton';
import PredictionCard from '../components/PredictionCard';

const marketplace = () => {
  return(
    <div className='marketplace'>
      <header>
        <SearchButtonWrapper />
        <WalletButtonWrapper />
      </header>
      <button className='createnewmarket'>Create New Market</button>
      <section className="ongoingpredictions">
        <h2 className="ongoingpredicitonsh2">Your Ongoing Predictions</h2>
        <div className="marketrec">
          <PredictionCard />
        </div>
      </section>

      <section>
        <h2 className="pastgoingpredictionsh2">Your Past Predictions</h2>
        <div className="marketrec">
          <PredictionCard />
        </div>
      </section>
    </div>
    
  );
}

export default marketplace