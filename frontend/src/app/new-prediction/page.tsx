import React from 'react'
import SearchButtonWrapper from '../components/SearchButton'
import WalletButtonWrapper from '../components/WalletButton'

const page = () => {
  return (
    <div className='new-prediction-container'>
      <header>
        <SearchButtonWrapper />
        <WalletButtonWrapper />
      </header>
      <div className='newPredictionForm-Container'>
        <div className='newPredictionForm'>
          <form>
            <div className='form-details'>
              <h1>Prediction Details</h1>
              <div>
                <h2>Prediction Title</h2>
                <input
                  type='text'
                  placeholder='Enter your prediction...'
                />
              </div>

              <div>
                <h2>Prediction Tags</h2>
                <input
                  type='text'
                  placeholder='Enter tags (comma separated)...'
                />
              </div>
            </div>
            <div className='form-timeline'>
              <h1>Prediction Timeline</h1>
              <div>
                <div className="prediction-end-date">
                  <h2>Prediction Ends</h2>
                  <input
                    type='datetime-local'
                    placeholder='Select date and time...'
                  />
                </div>
              </div>
              <div>
                <h2>Cut-off time</h2>
                <input
                  type='datetime-local'
                  placeholder='Select cut-off time...'
                />
              </div>
            </div>
            <div className='form-market-settings'>
              <div>
                <h1>Initial Price</h1>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1%', justifyContent: 'center' }}>
                  <div className='initial-price-choice-yes'>
                    <div className='yes-btn'>Yes</div>
                    <input
                      type='number'
                      placeholder='Enter initial price...'
                    />
                  </div>
                  <div className='initial-price-choice-no'>
                    <div className='no-btn'>No</div>
                    <input
                      type='number'
                      placeholder='Enter initial price...'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='form-submit'>
              <button type='submit'>Create Prediction</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default page