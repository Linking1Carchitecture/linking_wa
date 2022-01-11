import { useState } from 'react';
import { stopVideo } from '../components/Tab';

const useModal = () => {
  const [visible, setVisible] = useState(false);
  function toggle() {
    setVisible(!visible); 
    try{stopVideo()}catch{};
  }
  return {toggle, visible}
};

export default useModal;