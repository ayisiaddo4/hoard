import { validateEmail } from '../string-helpers';

describe('String Validation', () => {
  it('Should validate presense of email', async () => {
    const isValid = validateEmail({ email_address: null });
    expect(isValid).toEqual({ error: 'An email is required' });
  });

  it('Should validate valid email', async () => {
    const isValid = validateEmail({ email_address: '12345' });
    expect(isValid).toEqual({ error: 'Must be a valid email' });
  });

  it('Should validate valid email', async () => {
    const isValid = validateEmail({ email_address: 'eric@abc.com' });
    expect(isValid).toEqual(true);
  });

  it('Should validate valid email', async () => {
    const isValid = validateEmail({ email_address: '1@1.1' });
    expect(isValid).toEqual({ error: 'Must be a valid email' });
  });
});
