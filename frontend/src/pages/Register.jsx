import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'antd';
import RegisterForm from '@/forms/RegisterForm';
import useLanguage from '@/locale/useLanguage';
import { useState } from 'react';
import axios from 'axios';
import AuthModule from '@/modules/AuthModule';
import Loading from '@/components/Loading';
import { API_BASE_URL } from '@/config/serverApiConfig';

const Register = () => {
  const translate = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(API_BASE_URL + 'client/register', values);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const FormContainer = () => (
    <Loading isLoading={isLoading}>
      <Form layout="vertical" onFinish={onFinish}>
        <RegisterForm />
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            {translate('Register')}
          </Button>
          {translate('or')}{' '}
          <a href="/login">{translate('already_have_account_login')}</a>
        </Form.Item>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{translate('Registration successful! Redirecting to login...')}</div>}
      </Form>
    </Loading>
  );

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE={translate('sign_up')} isForRegistre={true} />;
};

export default Register; 