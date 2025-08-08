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

              <div style={{ display: 'flex', gap: '1em' }}>
                <div className="prediction-end-date">
                  <h3>Prediction End Date</h3>
                  <input
                    type='date'
                    placeholder='Select date...'
                  />
                </div>

                <div className="prediction-end-time">
                  <h3>Prediction End Time</h3>
                  <input
                    type='time'
                    placeholder='Select time...'
                  />
                </div>
              </div>
            </div>
            <div className='form-body'>
              <div>
                <h2>Prediction Amount</h2>
                <input
                  type='number'
                  placeholder='Enter amount...'
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default page