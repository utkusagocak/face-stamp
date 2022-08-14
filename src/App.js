import React, { useEffect, useState } from 'react';
import './App.scss';
import Canvas, { clearCanvas } from './Canvas/Canvas';
// https://commons.wikimedia.org/wiki/File:Karl_Marx_monochromatic.svg
import marx from './assests/Marx.png';
import terbiyesiz from './assests/terbiyesiz.png';
import { initStampAudio } from './StampAudio';

function App() {
  const [imageUrl, setImageUrl] = useState(marx);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const searchParamsString = window.location.search;
    const searchParams = new URLSearchParams(searchParamsString);
    const iURL = searchParams.get('image');
    if (iURL) {
      setImageUrl(iURL);
    }

    initStampAudio();
  }, []);

  function uploadImage(e) {
    const file = e?.target?.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl(marx);
    }
  }

  return (
    <>
      <div className="inner-border"></div>
      <Canvas imageUrl={imageUrl}></Canvas>

      <div className="control-panel">
        <div className="icon-button material-symbols-outlined" onClick={clearCanvas}>
          delete
        </div>
        <div className="icon-button material-symbols-outlined" onClick={() => setShowModal(true)}>
          approval
        </div>
      </div>

      <div style={{ display: showModal ? '' : 'none' }} className="import-stamp-modal-backdrop">
        <div className="import-stamp-modal">
          <div className="stamp-control">
            <div className="stamp-control-btn material-symbols-outlined" onClick={() => setShowModal(false)}>
              navigate_before
            </div>
            <div className="stamp-control-btn  material-symbols-outlined" style={{ fontSize: '30px' }} onClick={() => uploadImage()}>
              delete
            </div>
          </div>
          <div className="stamp-preview">
            <img src={imageUrl} width="200" height="200" />
          </div>
          <div className="stamp-upload-button">
            <input
              id="stamp-input"
              name="stamp-input"
              className="stamp-upload-input"
              type="file"
              accept="image/png, image/jpeg"
              onChange={uploadImage}
            ></input>
            <label htmlFor="stamp-input">Upload New Stamp</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
