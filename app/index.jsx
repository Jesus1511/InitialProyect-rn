import Navigations from '../Navigation';
import Toast from 'react-native-toast-message';

const index = () => {
  return (
    <>
      <Navigations />
      <Toast config={{ position: 'bottom' }} />
    </>
  )
}

export default index
