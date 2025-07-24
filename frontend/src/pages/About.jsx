import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'Invoices'}
      extra={
        <>
          <p>
          </p>
          <p>
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`tel:7984854781`);
            }}
          >
            {translate('Call us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
