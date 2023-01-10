import { CsvUploadedEvent, Subjects, Publisher } from '@adwesh/v2-common';

export class CsvUploadedPublisher extends Publisher<CsvUploadedEvent> {
  subject: Subjects.CsvUploaded = Subjects.CsvUploaded;
}
