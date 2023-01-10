import { Publisher, AuthSuccessfulEvent, Subjects } from '@adwesh/v2-common';

export class AuthSuccessfulPublisher extends Publisher<AuthSuccessfulEvent> {
  subject: Subjects.AuthSuccessful = Subjects.AuthSuccessful;
}
