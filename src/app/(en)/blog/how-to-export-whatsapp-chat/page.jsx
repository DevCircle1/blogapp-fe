import WhatsAppPage from '../../../../components/tools/flagship/whatsapp/WhatsAppPage.jsx';
import Seeded from '../../../_components/Seeded.jsx';

export const revalidate = 3600;

export default function Page() {
  return <Seeded path="/blog/how-to-export-whatsapp-chat"><WhatsAppPage path="/blog/how-to-export-whatsapp-chat" /></Seeded>;
}
