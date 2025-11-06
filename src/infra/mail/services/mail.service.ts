import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, username: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Welcome!',
        template: 'welcome',
        context: { username },
      });
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}`, error.stack);
    }
  }

  async sendNewRatingEmail(to: string, rating: number, username: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'New rating received!',
        template: 'new-rating',
        context: { rating, username },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send new rating email to ${to}`,
        error.stack,
      );
    }
  }
}
