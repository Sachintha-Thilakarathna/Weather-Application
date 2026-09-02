global.Reflect = global.Reflect || {};
global.Reflect.defineMetadata = global.Reflect.defineMetadata || (() => {});

jest.mock('@nestjs/config', () => ({ ConfigService: class ConfigService {} }), { virtual: true });

const { MailService } = require('./mail.service');

describe('MailService', () => {
  it('logs the OTP to the console when SMTP is not configured', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const config = {
      get: (key) => {
        const values = {
          SMTP_HOST: '',
          SMTP_PORT: '',
          SMTP_USER: '',
          SMTP_PASS: '',
          SMTP_FROM: '',
          SMTP_SECURE: '',
        };
        return values[key] ?? '';
      },
    };

    const service = new MailService(config);

    await expect(service.sendOtpEmail('user@example.com', '123456')).resolves.toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith('[MFA] OTP for user@example.com: 123456');

    logSpy.mockRestore();
  });
});
