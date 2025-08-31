import nodemailer from 'nodemailer';
import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 1, interval: 1000, intervalCap: 1 });

const runtimeConfig = useRuntimeConfig();

export const $sendToEmail = async (options: {
  html: string;
  to: string;
  subject: string;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: runtimeConfig.mailHost,
      port: +runtimeConfig.mailPort,
      ignoreTLS: true,
      secure: true,
      auth: {
        user: runtimeConfig.mailUser,
        pass: runtimeConfig.mailPassword,
      },
    });

    const result = await queue.add(() => {
      return transporter.sendMail({
        to: options.to,
        from: runtimeConfig.mailFrom,
        subject: options.subject,
        html: options.html,
      });
    });

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error?.message,
    });
  }
};
