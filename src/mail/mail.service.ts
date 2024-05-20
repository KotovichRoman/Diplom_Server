import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmationMail(user: User, token: string): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to SPMK81! Confirm your Email',
      template: 'confirmationEmail',
      context: {
        id: user.id,
        email: user.email,
        token: token,
      },
    });
  }
}
