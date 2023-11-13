// urlify.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'urlify',
})
export class UrlifyPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const replacedText = value.replace(
      urlRegex,
      (url) =>
        `<a style='color:var(--font-color-conv);' class='urlInMessage' href="${url}" target="_blank">${url}</a>`
    );
    return this.sanitizer.bypassSecurityTrustHtml(replacedText);
  }
}
