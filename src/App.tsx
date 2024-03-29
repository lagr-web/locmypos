
import { IonApp, setupIonicReact } from '@ionic/react';
import MyMap from './components/MyMap';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (

  <IonApp>

    <MyMap />

  </IonApp>
);

export default App;
